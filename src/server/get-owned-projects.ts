import {
	getCurrentClerkIdentity,
	listProjectsByAccess,
} from "#/lib/project-access";
import { createServerFn } from "@tanstack/react-start";

export const getOwnedProjects = createServerFn({ method: "GET" }).handler(
	async () => {
		const identity = await getCurrentClerkIdentity();

		if (!identity) {
			return { projects: [] };
		}

		const projects = await listProjectsByAccess(identity);

		return { projects };
	},
);
