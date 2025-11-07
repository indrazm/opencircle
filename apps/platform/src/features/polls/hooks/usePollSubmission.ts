import type { PollCreate, PostType } from "@opencircle/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api";

export const usePollSubmission = () => {
	const queryClient = useQueryClient();

	const { mutate: createPoll, isPending } = useMutation({
		mutationFn: async (data: {
			content: string;
			userId: string;
			channelId?: string;
			options: { text: string; order?: number }[];
			durationHours?: number;
		}) => {
			// First create the post
			const postData = {
				content: data.content,
				type: "poll" as PostType,
				user_id: data.userId,
				channel_id: data.channelId,
			};

			const post = await api.posts.create(postData);

			// Then create the poll with options
			const pollData: PollCreate = {
				post_id: post.id,
				duration_hours: data.durationHours || 24,
				options: data.options.map((opt) => ({
					text: opt.text,
					order: opt.order || 0,
				})),
			};

			const poll = await api.poll.create(pollData);
			return { post, poll };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["polls"] });
		},
	});

	return {
		createPoll,
		isSubmitting: isPending,
	};
};
