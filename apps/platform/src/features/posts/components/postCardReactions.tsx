import type { Post } from "@opencircle/core";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useReactionSubmission } from "../../reactions/hooks/useReactionSubmission";

interface PostCardReactionsProps {
	post: Post;
}

export const PostCardReactions = ({ post }: PostCardReactionsProps) => {
	const { submitReaction } = useReactionSubmission();

	return (
		<div className="flex items-center gap-1 text-sm">
			{post.reactions?.summary && post.reactions.summary.length > 0 ? (
				<div className="flex items-center gap-1">
					{post.reactions.summary.map((reaction) => (
						<div
							key={reaction.emoji}
							className={`flex items-center gap-2 px-2 py-1 rounded-full text-sm ${
								reaction.me
									? "bg-primary/20 border border-primary/30"
									: "bg-background-secondary hover:bg-background-tertiary cursor-pointer"
							}`}
							onClick={() => {
								if (reaction.me) {
									// Remove reaction if user already reacted
									submitReaction({
										post_id: post.id,
										emoji: reaction.emoji,
									});
								} else {
									// Add reaction
									submitReaction({
										post_id: post.id,
										emoji: reaction.emoji,
									});
								}
							}}
						>
							<span>{reaction.emoji}</span>
							<span>{reaction.count}</span>
						</div>
					))}
					{!post.reactions.summary.some((reaction) => reaction.me) && (
						<DropdownMenu.Root>
							<DropdownMenu.Trigger className="ml-1">
								<Smile strokeWidth={1.5} size={16} />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="start" side="bottom">
								<EmojiPicker
									theme={Theme.DARK}
									emojiStyle={EmojiStyle.TWITTER}
									reactionsDefaultOpen
									skinTonesDisabled
									onEmojiClick={(emojiData) => {
										submitReaction({
											post_id: post.id,
											emoji: emojiData.emoji,
										});
									}}
									className="z-[999999] bg-background"
								/>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					)}
				</div>
			) : (
				<div className="flex items-center gap-2">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Smile strokeWidth={1.5} size={18} />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="start" side="bottom">
							<EmojiPicker
								theme={Theme.DARK}
								emojiStyle={EmojiStyle.TWITTER}
								reactionsDefaultOpen
								skinTonesDisabled
								onEmojiClick={(emojiData) => {
									submitReaction({
										post_id: post.id,
										emoji: emojiData.emoji,
									});
								}}
								className="z-[999999] bg-background"
							/>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			)}
		</div>
	);
};
