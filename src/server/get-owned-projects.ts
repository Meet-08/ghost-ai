import { prisma } from "#/db";
import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";

export const getOwnedProjects = createServerFn({ method: "GET" }).handler(
	async () => {
		const { isAuthenticated, userId } = await auth();

		if (!isAuthenticated || !userId) {
			return { projects: [] };
		}

		const projects = await prisma.project.findMany({
			where: { ownerId: userId },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				name: true,
			},
		});

		return { projects };
	},
);
