import { useAuth } from "@clerk/tanstack-react-start";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { isSignedIn, isLoaded } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoaded) return;

		if (isSignedIn) {
			navigate({ to: "/editor", replace: true });
		} else {
			navigate({ to: "/sign-in", replace: true });
		}
	}, [isLoaded, isSignedIn, navigate]);

	return null;
}
