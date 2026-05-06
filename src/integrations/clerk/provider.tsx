import { ClerkProvider } from "@clerk/tanstack-react-start";
import { dark } from "@clerk/ui/themes";
import type { ReactNode } from "react";

interface ClerkProviderWrapperProps {
	children: ReactNode;
}

export default function ClerkProviderWrapper({
	children,
}: ClerkProviderWrapperProps) {
	return (
		<ClerkProvider
			appearance={{
				theme: dark,
			}}
			afterSignOutUrl="/sign-in"
		>
			{children}
		</ClerkProvider>
	);
}
