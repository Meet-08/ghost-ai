"use client";

import { ClerkProvider } from "@clerk/tanstack-react-start";
import { dark } from "@clerk/ui/themes";

interface ClerkProviderWrapperProps {
	children: React.ReactNode;
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
