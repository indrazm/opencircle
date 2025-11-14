import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/api";

export const useUser = (id: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ["user", { id }],
		queryFn: async () => {
			const response = await api.users.getById(id);
			return response;
		},
		enabled: !!id, // Only run query if id is provided
	});

	return {
		user: data,
		isUserLoading: isLoading,
	};
};
