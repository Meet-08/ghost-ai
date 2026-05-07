import { prisma } from "#/db";
import {
	forbiddenResponse,
	getAuthenticatedUserId,
	unauthorizedResponse,
} from "#/server/api-auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const renameProjectSchema = z.object({
	name: z.string().trim().min(1, "Project name is required"),
});

const projectSelect = {
	id: true,
	ownerId: true,
	name: true,
	description: true,
	status: true,
	canvasJsonPath: true,
	createdAt: true,
	updatedAt: true,
} as const;

export const Route = createFileRoute("/api/projects/$projectId")({
	server: {
		handlers: {
			PATCH: async ({ params, request }) => {
				const userId = await getAuthenticatedUserId();

				if (!userId) {
					return unauthorizedResponse();
				}

				const existingProject = await prisma.project.findUnique({
					where: { id: params.projectId },
					select: { id: true, ownerId: true },
				});

				if (!existingProject) {
					return Response.json({ error: "Project not found" }, { status: 404 });
				}

				if (existingProject.ownerId !== userId) {
					return forbiddenResponse();
				}

				let body: unknown;

				try {
					body = await request.json();
				} catch {
					return Response.json({ error: "Invalid JSON body" }, { status: 400 });
				}

				const parsed = renameProjectSchema.safeParse(body);

				if (!parsed.success) {
					return Response.json(
						{ error: "Project name is required" },
						{ status: 400 },
					);
				}

				const project = await prisma.project.update({
					where: { id: params.projectId },
					data: {
						name: parsed.data.name,
					},
					select: projectSelect,
				});

				return Response.json({ project });
			},
			DELETE: async ({ params }) => {
				const userId = await getAuthenticatedUserId();

				if (!userId) {
					return unauthorizedResponse();
				}

				const existingProject = await prisma.project.findUnique({
					where: { id: params.projectId },
					select: { id: true, ownerId: true },
				});

				if (!existingProject) {
					return Response.json({ error: "Project not found" }, { status: 404 });
				}

				if (existingProject.ownerId !== userId) {
					return forbiddenResponse();
				}

				await prisma.project.delete({
					where: { id: params.projectId },
				});

				return Response.json({ success: true });
			},
		},
	},
});
