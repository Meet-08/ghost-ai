import { Button } from "#/components/ui/button.tsx";
import { UserButton } from "@clerk/tanstack-react-start";
import { Bot, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react";

interface EditorNavbarProps {
	isSidebarOpen: boolean;
	onSidebarToggle: () => void;
	projectName?: string;
	isAISidebarOpen?: boolean;
	onAISidebarToggle?: () => void;
	onShareOpen?: () => void;
	showWorkspaceActions?: boolean;
}

export function EditorNavbar({
	isSidebarOpen,
	onSidebarToggle,
	projectName,
	isAISidebarOpen = false,
	onAISidebarToggle,
	onShareOpen,
	showWorkspaceActions = false,
}: EditorNavbarProps) {
	return (
		<nav className="fixed top-0 left-0 right-0 h-14 z-40 bg-background border-b border-border flex items-center px-4">
			{/* Left Section */}
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					onClick={onSidebarToggle}
					className="p-1"
					aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
				>
					{isSidebarOpen ? (
						<PanelLeftClose className="size-5" />
					) : (
						<PanelLeftOpen className="size-5" />
					)}
				</Button>
			</div>

			{/* Center Section */}
			<div className="flex-1 flex items-center justify-center">
				{projectName && (
					<div className="max-w-[45vw] truncate text-sm font-medium text-foreground">
						{projectName}
					</div>
				)}
			</div>

			{/* Right Section */}
			<div className="flex items-center gap-2">
				{showWorkspaceActions && (
					<>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onShareOpen}
							className="gap-2"
						>
							<Share2 className="size-4" />
							Share
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onAISidebarToggle}
							className={`gap-2 ${isAISidebarOpen ? "bg-secondary" : ""}`}
							aria-label={
								isAISidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
							}
						>
							<Bot className="size-4" />
							<span className="hidden sm:inline">AI</span>
						</Button>
					</>
				)}
				<UserButton />
			</div>
		</nav>
	);
}
