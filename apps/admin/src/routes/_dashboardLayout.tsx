import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashBoardLayout } from "../components/dashboardLayout";
import { useAccount } from "../features/auth/hooks/useAccount";

export const Route = createFileRoute("/_dashboardLayout")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isAccountLoading, isAccountError } = useAccount();

	if (isAccountLoading || isAccountError) {
		return null;
	}

	return (
		<DashBoardLayout>
			<Outlet />
		</DashBoardLayout>
	);
}
