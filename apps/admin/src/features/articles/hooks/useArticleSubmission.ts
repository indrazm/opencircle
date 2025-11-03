import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api";
import type {
	CreateArticleRequest,
	UpdateArticleRequest,
} from "../utils/types";

export const useArticleSubmission = () => {
	const queryClient = useQueryClient();

	const { mutate: createArticle, isPending: isCreating } = useMutation({
		mutationFn: async (data: CreateArticleRequest) => {
			const response = await api.articles.create({
				title: data.title,
				content: data.content,
				user_id: data.user_id,
				channel_id: data.channel_id,
			});
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["articles"] });
		},
	});

	const { mutate: updateArticle, isPending: isUpdating } = useMutation({
		mutationFn: async (data: UpdateArticleRequest) => {
			const updateData = {
				title: data.title,
				content: data.content,
			};

			const response = await api.articles.update(data.id, updateData);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["articles"] });
			queryClient.invalidateQueries({ queryKey: ["article"] });
		},
	});

	const { mutate: deleteArticle, isPending: isDeleting } = useMutation({
		mutationFn: async (articleId: string) => {
			const response = await api.articles.delete(articleId);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["articles"] });
		},
	});

	return {
		createArticle,
		updateArticle,
		deleteArticle,
		isSubmitting: isCreating || isUpdating || isDeleting,
		isCreating,
		isUpdating,
		isDeleting,
	};
};
