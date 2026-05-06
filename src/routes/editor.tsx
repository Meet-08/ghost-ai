import { EditorNavbar } from "#/components/editor/editor-navbar";
import { ProjectSidebar } from "#/components/editor/project-sidebar";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/editor")({
	component: EditorPage,
});

function EditorPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex flex-col h-screen bg-background">
			<EditorNavbar
				isSidebarOpen={isSidebarOpen}
				onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
			/>
			<ProjectSidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/>
			{/* Main content area - will be populated with editor canvas */}
			<main className="flex-1 mt-14 overflow-hidden bg-background">
				{/* Editor canvas will be rendered here */}
				<div className="w-full h-full flex items-center justify-center text-muted-foreground">
					<p>Editor canvas coming soon</p>
				</div>
			</main>
		</div>
	);
}
