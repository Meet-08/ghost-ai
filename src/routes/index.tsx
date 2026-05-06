import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="h-screen flex items-center justify-center">
			<h1 className="text-4xl font-bold">Welcome to Ghost AI</h1>
		</div>
	);
}
