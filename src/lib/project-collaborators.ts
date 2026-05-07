import { prisma } from "#/db";
import type { ClerkIdentity } from "#/lib/project-access";
import { clerkClient } from "@clerk/tanstack-react-start/server";

export interface CollaboratorProfile {
	id: string;
	email: string;
	displayName: string | null;
	avatarUrl: string | null;
	createdAt: string;
}

interface ClerkEmailAddress {
	emailAddress: string;
}

interface ClerkUserProfile {
	firstName: string | null;
	lastName: string | null;
	fullName: string | null;
	imageUrl: string;
	emailAddresses: ClerkEmailAddress[];
}

function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

function getDisplayName(user: ClerkUserProfile | undefined) {
	if (!user) {
		return null;
	}

	const displayName =
		user.fullName ??
		[user.firstName, user.lastName].filter(Boolean).join(" ").trim();

	return displayName || null;
}

async function getUsersByEmail(emails: string[]) {
	if (emails.length === 0) {
		return new Map<string, ClerkUserProfile>();
	}

	const response = await clerkClient().users.getUserList({
		emailAddress: emails,
	});
	const usersByEmail = new Map<string, ClerkUserProfile>();

	for (const user of response.data) {
		for (const emailAddress of user.emailAddresses) {
			const email = normalizeEmail(emailAddress.emailAddress);

			if (emails.includes(email)) {
				usersByEmail.set(email, user);
			}
		}
	}

	return usersByEmail;
}

export async function listProjectCollaborators(projectId: string) {
	const collaborators = await prisma.projectCollaborator.findMany({
		where: { projectId },
		orderBy: { createdAt: "asc" },
		select: {
			id: true,
			email: true,
			createdAt: true,
		},
	});
	const emails = collaborators.map((collaborator) =>
		normalizeEmail(collaborator.email),
	);
	let usersByEmail: Map<string, ClerkUserProfile>;
	try {
		usersByEmail = await getUsersByEmail(emails);
	} catch {
		usersByEmail = new Map<string, ClerkUserProfile>();
	}

	return collaborators.map((collaborator): CollaboratorProfile => {
		const email = normalizeEmail(collaborator.email);
		const user = usersByEmail.get(email);

		return {
			id: collaborator.id,
			email,
			displayName: getDisplayName(user),
			avatarUrl: user?.imageUrl ?? null,
			createdAt: collaborator.createdAt.toISOString(),
		};
	});
}

export async function getProjectAccessForIdentity(
	projectId: string,
	identity: ClerkIdentity,
) {
	const collaboratorEmail = identity.primaryEmail
		? normalizeEmail(identity.primaryEmail)
		: null;

	const project = await prisma.project.findFirst({
		where: {
			id: projectId,
			OR: [
				{ ownerId: identity.userId },
				...(collaboratorEmail
					? [
							{
								collaborators: {
									some: {
										email: collaboratorEmail,
									},
								},
							},
						]
					: []),
			],
		},
		select: {
			id: true,
			ownerId: true,
		},
	});

	if (!project) {
		return null;
	}

	return {
		project,
		access: project.ownerId === identity.userId ? "owner" : "collaborator",
	} as const;
}

export async function inviteProjectCollaborator(
	projectId: string,
	email: string,
) {
	const normalizedEmail = normalizeEmail(email);

	await prisma.projectCollaborator.upsert({
		where: {
			projectId_email: {
				projectId,
				email: normalizedEmail,
			},
		},
		create: {
			projectId,
			email: normalizedEmail,
		},
		update: {},
	});
}

export async function removeProjectCollaborator(
	projectId: string,
	collaboratorId: string,
) {
	await prisma.projectCollaborator.deleteMany({
		where: {
			id: collaboratorId,
			projectId,
		},
	});
}
