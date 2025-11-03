import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArticleEditor } from "../../features/articles/components/ArticleEditor";
import { useArticleSubmission } from "../../features/articles/hooks/useArticleSubmission";
import type {
	CreateArticleRequest,
	UpdateArticleRequest,
} from "../../features/articles/utils/types";
import { useAccount } from "../../features/auth/hooks/useAccount";

export const Route = createFileRoute("/_dashboardLayout/articles/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();
	const { createArticle, isSubmitting } = useArticleSubmission();
	const { account } = useAccount();

	const handleSave = async (
		data: CreateArticleRequest | UpdateArticleRequest,
	) => {
		if (!account?.id) {
			console.error("User not authenticated");
			return;
		}

		try {
			const articleData = data as CreateArticleRequest;
			await createArticle({
				...articleData,
				user_id: account.id,
			});
			// Redirect to articles list
			router.navigate({ to: "/articles" });
		} catch (error) {
			console.error("Failed to create article:", error);
		}
	};

	const handleCancel = () => {
		router.navigate({ to: "/articles" });
	};

	return (
		<ArticleEditor
			onSave={handleSave}
			onCancel={handleCancel}
			loading={isSubmitting}
			isEdit={false}
		/>
	);
}
