import {
	getCurrentClerkIdentity,
	getProjectByAccess,
	listProjectsByAccess,
} from "#/lib/project-access";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const workspaceParamsSchema = z.object({
	projectId: z.string().min(1),
});

export const getEditorWorkspace = createServerFn({ method: "GET" })
	.inputValidator((data: unknown) => workspaceParamsSchema.parse(data))
	.handler(async ({ data }) => {
		const identity = await getCurrentClerkIdentity();

		if (!identity) {
			throw redirect({ to: "/sign-in" });
		}

		const [project, projects] = await Promise.all([
			getProjectByAccess(data.projectId, identity),
			listProjectsByAccess(identity),
		]);

		if (!project) {
			return {
				hasAccess: false,
				project: null,
				projects,
			};
		}

		return {
			hasAccess: true,
			project: {
				id: project.id,
				name: project.name,
				access:
					project.ownerId === identity.userId
						? ("owner" as const)
						: ("collaborator" as const),
			},
			projects,
		};
	});
