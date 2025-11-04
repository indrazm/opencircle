import type { ResourceCreate } from "@opencircle/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api";

export const useResourceCreation = () => {
	const queryClient = useQueryClient();

	const { mutate: createResource, isPending } = useMutation({
		mutationFn: async (data: ResourceCreate) => {
			const response = await api.resources.create(data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resources"] });
		},
	});

	const { mutate: deleteResource, isPending: isDeleting } = useMutation({
		mutationFn: async (id: string) => {
			const response = await api.resources.delete(id);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resources"] });
		},
	});

	const { mutate: updateResource, isPending: isUpdating } = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: any }) => {
			const response = await api.resources.update(id, data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resources"] });
		},
	});

	return {
		createResource,
		deleteResource,
		updateResource,
		isSubmitting: isPending,
		isDeleting,
		isUpdating,
	};
};
