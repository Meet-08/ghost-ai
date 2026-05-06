import { createFileRoute } from "@tanstack/react-router";
import AuthLayout from "../components/auth/auth-layout";

export const Route = createFileRoute("/sign-in")({
	component: SignInLayout,
});

function SignInLayout() {
	return <AuthLayout />;
}
