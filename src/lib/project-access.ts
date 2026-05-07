import { prisma } from "#/db";
import { auth, clerkClient } from "@clerk/tanstack-react-start/server";

export interface ClerkIdentity {
	userId: string;
	primaryEmail: string | null;
}

export interface AccessibleProject {
	id: string;
	name: string;
	ownerId: string;
}

export async function getCurrentClerkIdentity(): Promise<ClerkIdentity | null> {
	const { isAuthenticated, userId } = await auth();

	if (!isAuthenticated || !userId) {
		return null;
	}

	const user = await clerkClient().users.getUser(userId);
	const primaryEmail =
		user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
			?.emailAddress ??
		user.emailAddresses[0]?.emailAddress ??
		null;

	return {
		userId,
		primaryEmail,
	};
}

export async function getProjectByAccess(
	projectId: string,
	identity: ClerkIdentity,
): Promise<AccessibleProject | null> {
	const collaboratorEmail = identity.primaryEmail?.toLowerCase();

	return prisma.project.findFirst({
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
			name: true,
			ownerId: true,
		},
	});
}

export async function listProjectsByAccess(identity: ClerkIdentity) {
	const collaboratorEmail = identity.primaryEmail?.toLowerCase();

	const projects = await prisma.project.findMany({
		where: {
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
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			name: true,
			ownerId: true,
		},
	});

	return projects.map((project) => ({
		id: project.id,
		name: project.name,
		access:
			project.ownerId === identity.userId
				? ("owner" as const)
				: ("collaborator" as const),
	}));
}
