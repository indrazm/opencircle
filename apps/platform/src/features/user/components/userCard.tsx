import type { User } from "@opencircle/core";
import { Avatar } from "@opencircle/ui";
import { useNavigate } from "@tanstack/react-router";
import { DropdownMenu } from "radix-ui";
import { getInitials } from "../../../utils/common";

interface UserCardProps {
	account: User;
}

export const UserCard = ({ account }: UserCardProps) => {
	const navigate = useNavigate();

	function handleLogout() {
		localStorage.removeItem("token");
		navigate({ to: "/login" });
	}

	return (
		<section className="h-14 flex items-center justify-between font-semibold text-sm px-4 border-b border-border">
			<div>{account.name}</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar
						image_url={account.avatar_url || ""}
						initials={getInitials(account.name)}
					/>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					sideOffset={10}
					align="end"
					className="rounded-lg overflow-hidden bg-background-secondary border border-border min-w-[200px] shadow-2xl text-xs font-medium"
				>
					<DropdownMenu.Item
						className="p-3 hover:bg-primary focus-within:outline-none"
						onClick={() =>
							navigate({
								to: "/$username",
								params: { username: account.username },
							})
						}
					>
						Profile
					</DropdownMenu.Item>
					<DropdownMenu.Item
						className="p-3 hover:bg-primary focus-within:outline-none"
						onClick={() => navigate({ to: "/edit-profile" })}
					>
						Edit Profile
					</DropdownMenu.Item>
					<DropdownMenu.Separator className="h-0.5 bg-border" />
					<DropdownMenu.Item
						className="p-3 hover:bg-primary focus-within:outline-none"
						onClick={handleLogout}
					>
						Logout
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</section>
	);
};
