import { createFileRoute } from "@tanstack/react-router";
import AuthLayout from "../components/auth/auth-layout";

export const Route = createFileRoute("/sign-up")({
	component: SignUpLayout,
});

function SignUpLayout() {
	return <AuthLayout />;
}
