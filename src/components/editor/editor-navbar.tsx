import { Button } from "#/components/ui/button.tsx";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface EditorNavbarProps {
	isSidebarOpen: boolean;
	onSidebarToggle: () => void;
}

export function EditorNavbar({
	isSidebarOpen,
	onSidebarToggle,
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
				{/* Empty for now */}
			</div>

			{/* Right Section */}
			<div className="flex items-center gap-2">{/* Empty for now */}</div>
		</nav>
	);
}
