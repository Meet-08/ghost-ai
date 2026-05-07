import { Button } from "#/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";

export function AccessDenied() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
			<section className="max-w-md rounded-3xl border border-border bg-card px-8 py-10 shadow-lg">
				<div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-secondary">
					<LockKeyhole className="size-7 text-muted-foreground" />
				</div>
				<h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
					Workspace unavailable
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted-foreground">
					This project does not exist, or you do not have access to open it.
				</p>
				<Button asChild className="mt-6">
					<Link to="/editor">Back to editor home</Link>
				</Button>
			</section>
		</main>
	);
}
