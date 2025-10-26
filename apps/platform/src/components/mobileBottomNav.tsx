import { Link } from "@tanstack/react-router";
import { Bell, List, Paperclip, User, Video } from "lucide-react";
import { useAccount } from "../features/auth/hooks/useAccount";

interface MobileNavItem {
	icon: React.ReactNode;
	label: string;
	to: string;
}

const mobileNavItems: MobileNavItem[] = [
	{
		icon: <List size={20} />,
		label: "Timeline",
		to: "/",
	},
	{
		icon: <Paperclip size={20} />,
		label: "Articles",
		to: "/articles",
	},
	{
		icon: <Video size={20} />,
		label: "Courses",
		to: "/courses",
	},
	{
		icon: <Bell size={20} />,
		label: "Notifications",
		to: "/notifications",
	},
];

export const MobileBottomNav = () => {
	const { account } = useAccount();

	const profileItem = account
		? {
				icon: <User size={20} />,
				label: "Profile",
				to: `/${account.username}`,
			}
		: null;

	const allItems = [...mobileNavItems, profileItem].filter(
		Boolean,
	) as MobileNavItem[];

	return (
		<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
			<div className="flex justify-around items-center h-16 px-2">
				{allItems.map((item) => (
					<Link
						key={item.to}
						to={item.to}
						className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 py-2 px-3 rounded-lg hover:bg-primary/10"
						activeProps={{
							className: "text-foreground bg-primary/10",
						}}
					>
						{item.icon}
						<span className="truncate max-w-[60px]">{item.label}</span>
					</Link>
				))}
			</div>
		</nav>
	);
};
