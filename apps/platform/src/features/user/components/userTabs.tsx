import type { Post } from "@opencircle/core";
import { useState } from "react";
import { PostCard } from "../../posts/components/postCard";

interface UserTabsProps {
	posts: Post[];
}

// TODO: Should be switch to ServerSide.
export const UserTabs = ({ posts }: UserTabsProps) => {
	const [activeTab, setActiveTab] = useState("posts");
	const userPosts = posts.filter((post) => post.type === "post");
	const userReplies = posts.filter((post) => post.type === "comment");

	return (
		<main>
			<section className="justify-center p-4 flex gap-8 border-y border-border">
				<div
					onClick={() => setActiveTab("posts")}
					className={`hover:text-primary/50 cursor-pointer transition duration-75 ${
						activeTab === "posts" ? "text-primary" : ""
					}`}
				>
					Posts
				</div>
				<div
					onClick={() => setActiveTab("replies")}
					className={`hover:text-primary/50 cursor-pointer transition duration-75 ${
						activeTab === "replies" ? "text-primary" : ""
					}`}
				>
					Replies
				</div>
			</section>
			{activeTab === "posts" && (
				<section>
					{userPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</section>
			)}
			{activeTab === "replies" && (
				<section>
					{userReplies.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</section>
			)}
		</main>
	);
};
