import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api";

export const usePollVoting = (pollId: string) => {
	const queryClient = useQueryClient();

	const { mutate: votePoll, isPending: isVoting } = useMutation({
		mutationFn: async (optionId: string) => {
			const vote = await api.poll.vote(pollId, { option_id: optionId });
			return vote;
		},
		onSuccess: () => {
			// Invalidate poll-specific queries
			queryClient.invalidateQueries({ queryKey: ["polls", pollId] });
			queryClient.invalidateQueries({ queryKey: ["polls", pollId, "results"] });
			// Invalidate post queries since polls are now embedded in posts
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post"] });
		},
	});

	const { mutate: changeVote, isPending: isChanging } = useMutation({
		mutationFn: async (optionId: string) => {
			const vote = await api.poll.changeVote(pollId, { option_id: optionId });
			return vote;
		},
		onSuccess: () => {
			// Invalidate poll-specific queries
			queryClient.invalidateQueries({ queryKey: ["polls", pollId] });
			queryClient.invalidateQueries({ queryKey: ["polls", pollId, "results"] });
			// Invalidate post queries since polls are now embedded in posts
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post"] });
		},
	});

	return {
		votePoll,
		changeVote,
		isSubmitting: isVoting || isChanging,
	};
};

export const usePollDelete = () => {
	const queryClient = useQueryClient();

	const { mutate: deletePoll, isPending } = useMutation({
		mutationFn: async (pollId: string) => {
			await api.poll.delete(pollId);
			return pollId;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["polls"] });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	return {
		deletePoll,
		isSubmitting: isPending,
	};
};
