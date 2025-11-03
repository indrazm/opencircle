import { createFileRoute } from "@tanstack/react-router";
import { UserTable } from "../../features/user/components/userTable";
import { useUsers } from "../../features/user/hooks/useUsers";

export const Route = createFileRoute("/_dashboardLayout/users")({
	component: RouteComponent,
});

function RouteComponent() {
	const { users, isUsersLoading } = useUsers();

	return (
		<main>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-medium">Users</h1>
			</div>
			<UserTable users={users} isLoading={isUsersLoading} />
		</main>
	);
}
