import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { HTTPError } from "ky";
import { api } from "../../../utils/api";

export const useAccount = () => {
	const navigate = useNavigate();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["account"],
		queryFn: async () => {
			const response = await api.account.getAccount();
			if (response.role !== "admin") {
				navigate({ to: "/" });
				throw new Error("Access denied: Admin role required");
			}
			console.log("Account data:", response);
			return response;
		},
		retry: (failureCount, error) => {
			// Don't retry on admin access errors
			if (error.message === "Access denied: Admin role required") {
				return false;
			}
			// Don't retry on HTTP auth errors
			if (
				error instanceof HTTPError &&
				(error.response.status === 401 || error.response.status === 403)
			) {
				return false;
			}
			return failureCount < 3;
		},
	});

	return {
		account: data,
		isAccountLoading: isLoading,
		isAccountError: isError,
		accountError: error,
		isAdmin: data?.role === "admin",
	};
};
