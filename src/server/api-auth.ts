import { auth } from "@clerk/tanstack-react-start/server";

export async function getAuthenticatedUserId() {
	const { isAuthenticated, userId } = await auth();

	if (!isAuthenticated || !userId) {
		return null;
	}

	return userId;
}

export function unauthorizedResponse() {
	return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbiddenResponse() {
	return Response.json({ error: "Forbidden" }, { status: 403 });
}
