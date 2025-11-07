import type { Poll, Post } from "@opencircle/core";
import { Avatar } from "@opencircle/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, Clock, EllipsisVertical, Loader2, PinIcon } from "lucide-react";
import moment from "moment";
import { DropdownMenu } from "radix-ui";
import { useId, useMemo } from "react";
import { getInitials } from "../../../utils/common";
import { useAccount } from "../../auth/hooks/useAccount";
import { usePostDelete } from "../../posts/hooks/usePostDelete";
import { usePollVoting } from "../hooks/usePollVoting";

interface PollCardProps {
	post: Post;
}

export const PollCard = ({ post }: PollCardProps) => {
	const poll = post.poll as Poll;
	const { account } = useAccount();
	const { deletePost } = usePostDelete();
	const { votePoll, changeVote, isSubmitting } = usePollVoting(poll.id);
	const navigate = useNavigate();
	const initials = getInitials(post.user.username);
	const gradientId = useId();

	const timeRemaining = useMemo(() => {
		if (!poll.is_active) return "Poll ended";
		return "Poll active";
	}, [poll.is_active]);

	const hasVoted = !!poll.user_vote;
	const selectedOptionId = poll.user_vote?.option_id;

	const handleVote = async (optionId: string) => {
		if (isSubmitting || !account?.id || !poll.is_active) return;

		try {
			if (hasVoted) {
				await changeVote(optionId);
			} else {
				await votePoll(optionId);
			}
		} catch (error) {
			console.error("Failed to vote:", error);
		}
	};

	const getVotePercentage = (voteCount: number, totalVotes: number) => {
		if (totalVotes === 0) return 0;
		return Math.round((voteCount / totalVotes) * 100);
	};

	return (
		<main className="relative max-w-2xl space-y-2 border-border border-b p-4">
			{/* Header with pin and delete menu */}
			<div className="absolute top-4 right-4 flex items-center justify-center gap-2">
				{post.is_pinned && <PinIcon className="h-3 w-3 fill-foreground" />}
				{post.user_id === account?.id && (
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild>
							<div className="flex h-6 w-6 items-center justify-center rounded-lg bg-background-secondary">
								<EllipsisVertical size={12} />
							</div>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							sideOffset={10}
							align="end"
							className="min-w-[80px] overflow-hidden rounded-lg border border-border bg-background-secondary font-medium text-xs shadow-2xl"
						>
							<DropdownMenu.Item
								className="p-3 focus-within:outline-none hover:bg-primary"
								onClick={() => deletePost(post.id)}
							>
								Delete
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				)}
			</div>

			{/* User info section */}
			<section className="flex items-center gap-2">
				<Avatar initials={initials} image_url={post.user.avatar_url || ""} />
				<Link
					to="/$username"
					params={{ username: post.user.username }}
					className="group"
				>
					<div className="space-y-0.5">
						<div className="flex items-center gap-1 group-hover:underline">
							<div>{post.user.name || post.user.email}</div>
							{post.user.role === "admin" && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1.1em"
									height="1.1em"
									viewBox="0 0 24 24"
									className="mt-1"
								>
									<title>verified</title>
									<defs>
										<linearGradient
											id={gradientId}
											x1="0%"
											y1="0%"
											x2="100%"
											y2="0%"
										>
											<stop offset="0%" stopColor="rgb(234 125 8)" />
											<stop offset="100%" stopColor="rgb(234 179 8)" />
										</linearGradient>
									</defs>
									<path
										fill={`url(#${gradientId})`}
										d="m8.6 22.5l-1.9-3.2l-3.6-.8l.35-3.7L1 12l2.45-2.8l-.35-3.7l3.6-.8l1.9-3.2L12 2.95l3.4-1.45l1.9 3.2l3.6.8l-.35 3.7L23 12l-2.45 2.8l.35 3.7l-3.6.8l-1.9 3.2l-3.4-1.45zm2.35-6.95L16.6 9.9l-1.4-1.45l-4.25 4.25l-2.15-2.1L7.4 12z"
									/>
								</svg>
							)}
						</div>
						<p className="text-foreground/50 text-xs">
							{post.user.bio || `@${post.user.username}`}
						</p>
					</div>
				</Link>
			</section>

			{/* Poll content section */}
			<section className="ml-10 space-y-4">
				{/* Poll description/question */}
				{post.content && (
					<div
						className="block cursor-pointer"
						onClick={() =>
							navigate({ to: "/posts/$id", params: { id: post.id } })
						}
					>
						<p className="whitespace-pre-line text-foreground">
							{post.content}
						</p>
					</div>
				)}

				{/* Poll options */}
				<div className="space-y-2">
					{poll.options.map((option) => {
						const isSelected = option.id === selectedOptionId;
						const percentage = getVotePercentage(
							option.vote_count,
							poll.total_votes,
						);

						return (
							<button
								key={option.id}
								type="button"
								onClick={() => handleVote(option.id)}
								disabled={!poll.is_active || !account?.id || isSubmitting}
								className={`w-full rounded-lg border border-primary/20 p-3 text-left transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary/5${isSelected ? "border-primary bg-primary/10" : ""}
								`}
							>
								<div className="flex items-center justify-between">
									<span className="font-medium text-foreground text-sm">
										{option.text}
									</span>
									<div className="flex items-center gap-2">
										{(hasVoted || !poll.is_active) && (
											<>
												<span className="font-bold text-primary">
													{percentage}%
												</span>
												{isSelected && (
													<Check size={16} className="text-primary" />
												)}
											</>
										)}
									</div>
								</div>

								{/* Vote progress bar */}
								{(hasVoted || !poll.is_active) && percentage > 0 && (
									<div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
										<div
											className="h-full bg-primary transition-all duration-300"
											style={{ width: `${percentage}%` }}
										/>
									</div>
								)}
							</button>
						);
					})}
				</div>

				{/* Poll metadata footer */}
				<div
					className="-ml-1 mt-4 flex cursor-pointer items-center gap-2"
					onClick={() =>
						navigate({ to: "/posts/$id", params: { id: post.id } })
					}
				>
					{post.channel && (
						<div className="flex w-fit rounded-full bg-background-secondary px-2 py-1 font-medium text-xs">
							{post.channel.emoji} {post.channel.name}
						</div>
					)}
					<div className="flex items-center gap-2 text-foreground/50 text-xs">
						<Clock size={14} />
						{timeRemaining}
					</div>
					<div className="text-foreground/50 text-xs">
						{moment.utc(post.created_at).fromNow()}
					</div>
				</div>

				{/* Poll stats footer */}
				<section className="flex items-center gap-4">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<div className="flex items-center gap-1">
							<span>{poll.total_votes}</span>
							<span>{poll.total_votes === 1 ? "vote" : "votes"}</span>
						</div>
					</div>
					{isSubmitting && (
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<Loader2 size={14} className="animate-spin" />
							<span>{hasVoted ? "Changing vote..." : "Voting..."}</span>
						</div>
					)}
				</section>
			</section>
		</main>
	);
};
