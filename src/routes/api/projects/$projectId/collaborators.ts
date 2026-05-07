import {
	getProjectAccessForIdentity,
	inviteProjectCollaborator,
	listProjectCollaborators,
	removeProjectCollaborator,
} from "#/lib/project-collaborators";
import { getCurrentClerkIdentity } from "#/lib/project-access";
import { forbiddenResponse, unauthorizedResponse } from "#/server/api-auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const inviteCollaboratorSchema = z.object({
	email: z.email().trim().toLowerCase(),
});

const removeCollaboratorSchema = z.object({
	collaboratorId: z.string().min(1),
});

export const Route = createFileRoute("/api/projects/$projectId/collaborators")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const identity = await getCurrentClerkIdentity();

				if (!identity) {
					return unauthorizedResponse();
				}

				const access = await getProjectAccessForIdentity(
					params.projectId,
					identity,
				);

				if (!access) {
					return forbiddenResponse();
				}

				const collaborators = await listProjectCollaborators(params.projectId);

				return Response.json({
					collaborators,
					access: access.access,
				});
			},
			POST: async ({ params, request }) => {
				const identity = await getCurrentClerkIdentity();

				if (!identity) {
					return unauthorizedResponse();
				}

				const access = await getProjectAccessForIdentity(
					params.projectId,
					identity,
				);

				if (!access) {
					return forbiddenResponse();
				}

				if (access.access !== "owner") {
					return forbiddenResponse();
				}

				let body: unknown;

				try {
					body = await request.json();
				} catch {
					return Response.json({ error: "Invalid JSON body" }, { status: 400 });
				}

				const parsed = inviteCollaboratorSchema.safeParse(body);

				if (!parsed.success) {
					return Response.json(
						{ error: "A valid collaborator email is required" },
						{ status: 400 },
					);
				}

				if (parsed.data.email === identity.primaryEmail?.toLowerCase()) {
					return Response.json(
						{ error: "Project owners cannot invite themselves" },
						{ status: 400 },
					);
				}

				await inviteProjectCollaborator(params.projectId, parsed.data.email);

				const collaborators = await listProjectCollaborators(params.projectId);

				return Response.json(
					{ collaborators, access: access.access },
					{ status: 201 },
				);
			},
			DELETE: async ({ params, request }) => {
				const identity = await getCurrentClerkIdentity();

				if (!identity) {
					return unauthorizedResponse();
				}

				const access = await getProjectAccessForIdentity(
					params.projectId,
					identity,
				);

				if (!access) {
					return forbiddenResponse();
				}

				if (access.access !== "owner") {
					return forbiddenResponse();
				}

				let body: unknown;

				try {
					body = await request.json();
				} catch {
					return Response.json({ error: "Invalid JSON body" }, { status: 400 });
				}

				const parsed = removeCollaboratorSchema.safeParse(body);

				if (!parsed.success) {
					return Response.json(
						{ error: "A collaborator ID is required" },
						{ status: 400 },
					);
				}

				await removeProjectCollaborator(
					params.projectId,
					parsed.data.collaboratorId,
				);

				const collaborators = await listProjectCollaborators(params.projectId);

				return Response.json({ collaborators, access: access.access });
			},
		},
	},
});
