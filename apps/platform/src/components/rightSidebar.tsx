import { Button } from "@opencircle/ui";
import { Link } from "@tanstack/react-router";
import { useAccount } from "../features/auth/hooks/useAccount";
import { UserCard } from "../features/user/components/userCard";

export const RightSidebar = () => {
	const { account } = useAccount();

	return (
		<div className="sticky top-0 h-screen">
			{account ? (
				<UserCard account={account} />
			) : (
				<section className="px-4 h-14 flex justify-between items-center">
					<div />
					<div className="flex gap-4 items-center">
						<Link to="/register">
							<div className="text-xs font-medium">Sign up</div>
						</Link>
						<Link to="/login">
							<Button size="sm">Login</Button>
						</Link>
					</div>
				</section>
			)}
			<main className="p-4 space-y-8"></main>
		</div>
	);
};
