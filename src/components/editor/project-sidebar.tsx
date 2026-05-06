import { Button } from "#/components/ui/button.tsx";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "#/components/ui/tabs.tsx";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface ProjectSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
	const [activeTab, setActiveTab] = useState("my-projects");

	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 z-30 bg-black/50"
					onClick={onClose}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<aside
				aria-hidden={!isOpen}
				inert={!isOpen}
				className={`fixed left-0 top-0 bottom-0 z-40 w-64 bg-background border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-4 border-b border-border">
					<h2 className="text-base font-semibold">Projects</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						className="p-1"
						tabIndex={isOpen ? 0 : -1}
						aria-label="Close sidebar"
					>
						<X className="size-4" />
					</Button>
				</div>

				{/* Tabs */}
				<div className="flex-1 overflow-hidden flex flex-col">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1 flex flex-col px-2 pt-2"
					>
						<TabsList className="w-full">
							<TabsTrigger
								value="my-projects"
								className="flex-1"
								tabIndex={isOpen ? 0 : -1}
							>
								My Projects
							</TabsTrigger>
							<TabsTrigger
								value="shared"
								className="flex-1"
								tabIndex={isOpen ? 0 : -1}
							>
								Shared
							</TabsTrigger>
						</TabsList>

						{/* My Projects Tab */}
						<TabsContent
							value="my-projects"
							className="flex-1 flex items-center justify-center"
							tabIndex={isOpen ? 0 : -1}
						>
							<div className="text-center">
								<p className="text-sm text-muted-foreground">No projects yet</p>
								<p className="text-xs text-muted-foreground mt-1">
									Create your first project to get started
								</p>
							</div>
						</TabsContent>

						{/* Shared Tab */}
						<TabsContent
							value="shared"
							className="flex-1 flex items-center justify-center"
							tabIndex={isOpen ? 0 : -1}
						>
							<div className="text-center">
								<p className="text-sm text-muted-foreground">
									No shared projects
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									Projects shared with you will appear here
								</p>
							</div>
						</TabsContent>
					</Tabs>
				</div>

				{/* New Project Button */}
				<div className="px-4 py-4 border-t border-border">
					<Button className="w-full" size="sm" tabIndex={isOpen ? 0 : -1}>
						<Plus className="size-4" />
						New Project
					</Button>
				</div>
			</aside>
		</>
	);
}
