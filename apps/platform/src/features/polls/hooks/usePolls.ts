import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/api";

// Note: getAll method not implemented in polls router yet
// export const usePolls = () => {
//	return useQuery({
//		queryKey: ["polls"],
//		queryFn: async () => {
//			const polls = await api.poll.getAll();
//			return polls;
//		},
//	});
//};

export const usePoll = (pollId: string) => {
	return useQuery({
		queryKey: ["polls", pollId],
		queryFn: async () => {
			const poll = await api.poll.getById(pollId);
			return poll;
		},
		enabled: !!pollId,
	});
};

export const usePollByPostId = (postId: string) => {
	return useQuery({
		queryKey: ["polls", "post", postId],
		queryFn: async () => {
			const poll = await api.poll.getByPostId(postId);
			return poll;
		},
		enabled: !!postId,
	});
};

export const usePollResults = (pollId: string) => {
	return useQuery({
		queryKey: ["polls", pollId, "results"],
		queryFn: async () => {
			const results = await api.poll.getResults(pollId);
			return results;
		},
		enabled: !!pollId,
	});
};
