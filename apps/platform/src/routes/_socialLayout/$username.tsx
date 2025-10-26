import { Avatar } from "@opencircle/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../../components/header";
import { usePosts } from "../../features/posts/hooks/usePosts";
import { UserTabs } from "../../features/user/components/userTabs";
import { useUser } from "../../features/user/hooks/useUser";
import { getInitials } from "../../utils/common";

export const Route = createFileRoute("/_socialLayout/$username")({
	component: UserDetail,
});

function UserDetail() {
	const username = Route.useParams().username;
	const { user } = useUser(username);
	const { posts } = usePosts({ userId: user?.id });

	if (!user) {
		return <div>User not found</div>;
	}

	const initials = getInitials(user.name);

	return (
		<main>
			<Header label="Back" />
			<section className="flex flex-col items-center py-12 space-y-4">
				<Avatar
					size="xl"
					initials={initials}
					image_url={user.avatar_url || ""}
				/>
				<main className="flex flex-col items-center gap-4">
					<div className="text-center space-y-2">
						<div className="text-xl">{user.name}</div>
						<div className="text-xs font-medium text-foreground/50">
							{user.email}
						</div>
					</div>
					<div>{user.bio}</div>
				</main>
			</section>
			<UserTabs posts={posts} />
		</main>
	);
}
