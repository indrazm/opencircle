import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { api } from "../../../utils/api";

export const useNotifications = (skip: number = 0, limit: number = 100) => {
	const { data, isLoading, isError, error, refetch } = useQuery({
		enabled: localStorage.getItem("token") !== null,
		queryKey: ["notifications", skip, limit],
		queryFn: async () => {
			const response = await api.notifications.getAll(skip, limit);
			return response;
		},
		retry: (failureCount, error) => {
			if (error instanceof HTTPError && error.response.status === 401) {
				return false;
			}
			return failureCount < 3;
		},
	});

	return {
		notifications: data || [],
		isNotificationsLoading: isLoading,
		isNotificationsError: isError,
		notificationsError: error,
		refetchNotifications: refetch,
	};
};

export const useMarkNotificationAsRead = () => {
	const queryClient = useQueryClient();

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: async (notificationId: string) => {
			const response = await api.notifications.markAsRead(notificationId);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		retry: (failureCount, error) => {
			if (error instanceof HTTPError && error.response.status === 401) {
				return false;
			}
			return failureCount < 3;
		},
	});

	return {
		markAsRead: mutate,
		isMarkingAsRead: isPending,
		isMarkAsReadError: isError,
		markAsReadError: error,
	};
};
