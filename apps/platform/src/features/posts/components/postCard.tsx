import type { Post } from "@opencircle/core";
import { Avatar } from "@opencircle/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { EllipsisVertical, MessageCircle } from "lucide-react";
import moment from "moment";
import { DropdownMenu } from "radix-ui";
import { getInitials } from "../../../utils/common";
import { useAccount } from "../../auth/hooks/useAccount";
import { UrlPreview } from "../../extras/components/UrlPreview";
import { MediaGallery } from "../../media/components/media";
import { usePostDelete } from "../hooks/usePostDelete";
import { renderContent } from "../utils";
import { PostCardReactions } from "./postCardReactions";
import { PostCommentSummary } from "./postCommentSummary";

interface PostCardProps {
	post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
	const initials = getInitials(post.user.username);
	const { account } = useAccount();
	const { deletePost } = usePostDelete();

	const navigate = useNavigate();

	return (
		<main className="relative border-b border-border p-4 space-y-2 max-w-2xl">
			{post.user_id === account?.id && (
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<div className="w-6 h-6 bg-background-secondary absolute top-4 right-4 flex justify-center items-center rounded-lg">
							<EllipsisVertical size={12} className="" />
						</div>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						sideOffset={10}
						align="end"
						className="rounded-lg overflow-hidden bg-background-secondary border border-border min-w-[80px] shadow-2xl text-xs font-medium"
					>
						<DropdownMenu.Item
							className="p-3 hover:bg-primary focus-within:outline-none"
							onClick={() => deletePost(post.id)}
						>
							Delete
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			)}
			<section className="flex gap-2 items-center">
				<Avatar initials={initials} image_url={post.user.avatar_url || ""} />
				<Link
					to="/$username"
					params={{ username: post.user.username }}
					className="group"
				>
					<div className="space-y-0.5">
						<div className="group-hover:underline">
							{post.user.name || post.user.email}
						</div>
						<p className="text-foreground/50 text-xs">
							{post.user.bio || post.user.username}
						</p>
					</div>
				</Link>
			</section>
			<section className="ml-10 space-y-4">
				<div
					className="block cursor-pointer"
					onClick={() =>
						navigate({ to: "/posts/$id", params: { id: post.id } })
					}
				>
					<p className="whitespace-pre-line">{renderContent(post.content)}</p>
					<UrlPreview content={post.content} />
				</div>
				<MediaGallery media={post.medias} />
				<div className="flex gap-2 items-center mt-4 -ml-1">
					{post.channel && (
						<div className="flex px-2 py-1 rounded-full text-xs font-medium bg-background-secondary w-fit ">
							{post.channel.emoji} {post.channel.name}
						</div>
					)}
					<div className="text-xs text-foreground/50">
						{moment.utc(post.created_at).fromNow()}
					</div>
				</div>
				<section className="flex gap-4 items-center">
					<PostCardReactions post={post} />
					<div className="flex items-center gap-2 text-sm">
						<MessageCircle size={18} />
						<div>{post.comment_count}</div>
					</div>
					{post.comment_summary?.names && (
						<PostCommentSummary names={post.comment_summary.names} />
					)}
				</section>
			</section>
		</main>
	);
};
