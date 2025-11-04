import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/api";

export const useResources = (channelId?: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ["resources", { channelId }],
		queryFn: async () => {
			if (channelId) {
				return await api.resources.getByChannel(channelId);
			}
			return await api.resources.getAll();
		},
	});

	return {
		resources: data,
		isResourcesLoading: isLoading,
	};
};
