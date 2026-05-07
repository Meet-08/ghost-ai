import { prisma } from "#/db";
import {
	getAuthenticatedUserId,
	unauthorizedResponse,
} from "#/server/api-auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const createProjectSchema = z
	.object({
		name: z.string().optional(),
	})
	.loose();

export const Route = createFileRoute("/api/projects")({
	server: {
		handlers: {
			GET: async () => {
				const userId = await getAuthenticatedUserId();

				if (!userId) {
					return unauthorizedResponse();
				}

				const projects = await prisma.project.findMany({
					where: { ownerId: userId },
					orderBy: { createdAt: "desc" },
				});

				return Response.json({ projects });
			},
			POST: async ({ request }) => {
				const userId = await getAuthenticatedUserId();

				if (!userId) {
					return unauthorizedResponse();
				}

				let body: unknown = {};

				try {
					body = await request.json();
				} catch {
					body = {};
				}

				const parsed = createProjectSchema.safeParse(body);
				const trimmedName = parsed.success
					? parsed.data.name?.trim()
					: undefined;
				const name = trimmedName || "Untitled Project";

				const project = await prisma.project.create({
					data: {
						ownerId: userId,
						name,
					},
				});

				return Response.json({ project }, { status: 201 });
			},
		},
	},
});
