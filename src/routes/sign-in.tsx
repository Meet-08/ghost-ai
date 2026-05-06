import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FileText, Share2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/sign-in")({
	component: SignInLayout,
});

function SignInLayout() {
	return (
		<div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-2">
			{/* Left Panel - Hidden on mobile */}
			<div className="hidden lg:flex flex-col justify-between p-12 bg-[#111114] border-r border-border/50 text-card-foreground">
				{/* Logo */}
				<div className="flex items-center gap-2">
					<div className="size-6 bg-primary rounded-md" />
					<span className="font-bold text-lg">Ghost AI</span>
				</div>

				{/* Features Section */}
				<div className="max-w-md">
					<h1 className="text-[2.5rem] font-semibold tracking-tight leading-tight mb-4 text-foreground">
						Design systems at the
						<br />
						speed of thought.
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed mb-12">
						Describe your architecture in plain English. Ghost AI maps it to a
						shared canvas your whole team can refine in real time.
					</p>

					<div className="space-y-8">
						{/* Feature 1 */}
						<div className="flex gap-4">
							<div className="shrink-0 mt-1 size-8 rounded-md bg-card border border-border flex items-center justify-center text-primary">
								<Sparkles className="size-4" />
							</div>
							<div>
								<h3 className="font-medium text-foreground mb-1">
									AI Architecture Generation
								</h3>
								<p className="text-sm text-muted-foreground">
									Describe your system, AI maps it to nodes and edges on a live
									canvas.
								</p>
							</div>
						</div>

						{/* Feature 2 */}
						<div className="flex gap-4">
							<div className="shrink-0 mt-1 size-8 rounded-md bg-card border border-border flex items-center justify-center text-primary">
								<Share2 className="size-4" />
							</div>
							<div>
								<h3 className="font-medium text-foreground mb-1">
									Real-time Collaboration
								</h3>
								<p className="text-sm text-muted-foreground">
									Live cursors, presence indicators, and shared node editing
									across your team.
								</p>
							</div>
						</div>

						{/* Feature 3 */}
						<div className="flex gap-4">
							<div className="shrink-0 mt-1 size-8 rounded-md bg-card border border-border flex items-center justify-center text-primary">
								<FileText className="size-4" />
							</div>
							<div>
								<h3 className="font-medium text-foreground mb-1">
									Instant Spec Generation
								</h3>
								<p className="text-sm text-muted-foreground">
									Export a complete Markdown technical spec directly from the
									canvas graph.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer Text */}
				<p className="text-sm text-muted-foreground">
					© 2026 Ghost AI. All rights reserved.
				</p>
			</div>

			{/* Right Panel - Clerk Form */}
			<div className="flex items-center justify-center p-6 lg:p-0">
				<div className="w-full max-w-sm">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
