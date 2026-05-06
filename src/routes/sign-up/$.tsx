import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up/$")({
	component: SignUpRoute,
});

function SignUpRoute() {
	return (
		<SignUp
			routing="path"
			path="/sign-up"
			appearance={{
				variables: {
					colorPrimary: "var(--color-accent)",
					colorBackground: "var(--color-background)",
					colorNeutral: "var(--color-muted-foreground)",
					borderRadius: "0.375rem",
					fontSize: "14px",
					fontFamily: "var(--font-sans)",
				},
			}}
		/>
	);
}
