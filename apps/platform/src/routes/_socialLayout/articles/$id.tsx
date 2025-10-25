import { Button } from "@opencircle/ui";
import { createFileRoute } from "@tanstack/react-router";
import MDEditor from "@uiw/react-md-editor";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Header } from "../../../components/header";
import { useArticle } from "../../../features/articles/hooks/useArticle";
import { useAccount } from "../../../features/auth/hooks/useAccount";
import { PostCardReactions } from "../../../features/posts/components/postCardReactions";
import { ReplyForm } from "../../../features/posts/components/replyForm";

export const Route = createFileRoute("/_socialLayout/articles/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const { article, isLoading } = useArticle(id);
	const { account } = useAccount();
	const [showCommentForm, setShowCommentForm] = useState(false);

	if (isLoading) return <div>Loading...</div>;

	return (
		<main>
			<Header label="Back" />
			<div className="prose prose-invert prose-headings:font-medium max-w-none p-4">
				<div className="prose prose-invert prose-headings:text-xl prose-headings:text-foreground prose-headings:font-medium prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground/70">
					<h3 className="text-xl">{article?.title}</h3>
					<MDEditor.Markdown
						source={article?.content}
						className="!bg-transparent"
					/>
				</div>
				{article && (
					<>
						<section className="flex gap-4 items-center mt-6 pt-4 border-t border-border">
							<PostCardReactions post={article} />
							<div className="flex items-center gap-2 text-sm">
								<MessageCircle size={18} />
								<div>{article.comment_count}</div>
							</div>
							<Button
								size="sm"
								variant="secondary"
								onClick={() => setShowCommentForm(!showCommentForm)}
								disabled={!account}
							>
								{showCommentForm ? "Cancel" : "Comment"}
							</Button>
						</section>

						{showCommentForm && (
							<ReplyForm
								parentId={article.id}
								onReply={() => setShowCommentForm(false)}
							/>
						)}
					</>
				)}
			</div>
		</main>
	);
}
