import {
	getCurrentClerkIdentity,
	getProjectByAccess,
} from "#/lib/project-access";
import { forbiddenResponse, unauthorizedResponse } from "#/server/api-auth";
import {
	colorForUserId,
	liveblocksSecretKey,
} from "#/server/liveblocks.server";
import { clerkClient } from "@clerk/tanstack-react-start/server";
import { Liveblocks } from "@liveblocks/node";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z
	.object({
		projectId: z.string().optional(),
		room: z.string().optional(),
	})
	.strict();

export const Route = createFileRoute("/api/liveblocks-auth")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				let body: unknown = {};
				try {
					body = await request.json();
				} catch {
					body = {};
				}

				const parsed = bodySchema.safeParse(body);
				if (!parsed.success) {
					return Response.json({ error: "Invalid body" }, { status: 400 });
				}

				const roomId = parsed.data.room ?? parsed.data.projectId;
				if (!roomId) {
					return Response.json({ error: "Invalid body" }, { status: 400 });
				}

				const identity = await getCurrentClerkIdentity();
				if (!identity) return unauthorizedResponse();

				const project = await getProjectByAccess(roomId, identity);
				if (!project) return forbiddenResponse();

				const user = await clerkClient()
					.users.getUser(identity.userId)
					.catch(() => null);

				const displayName =
					user && (user.firstName || user.lastName)
						? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
						: ((user?.fullName as string | undefined) ?? null);

				const avatarUrl =
					(user as unknown as Record<string, unknown>)?.profileImageUrl ??
					(user as unknown as Record<string, unknown>)?.imageUrl ??
					null;

				const cursorColor = colorForUserId(identity.userId);
				const liveblocks = new Liveblocks({
					secret: liveblocksSecretKey(),
				});

				try {
					const session = liveblocks.prepareSession(identity.userId, {
						userInfo: {
							displayName,
							avatarUrl,
							cursorColor,
						},
					});

					session.allow(roomId, session.FULL_ACCESS);

					const { body, status } = await session.authorize();

					return new Response(body, { status });
				} catch (err: unknown) {
					let message = "Unknown error";
					if (typeof err === "object" && err !== null) {
						const e = err as Record<string, unknown>;
						if (typeof e.message === "string") message = e.message;
						else message = String(e);
					} else {
						message = String(err);
					}

					return Response.json({ error: message }, { status: 500 });
				}
			},
		},
	},
});
