import { Button } from "@opencircle/ui";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Edit, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import type { Article } from "../utils/types";

interface ArticleViewProps {
	article: Article;
	onEdit?: () => void;
	onDelete?: () => void;
}

export const ArticleView = ({
	article,
	onEdit,
	onDelete,
}: ArticleViewProps) => {
	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header Actions */}
			<div className="flex justify-between items-center">
				<Link to="/articles">
					<Button size="sm">
						<ArrowLeft size={16} className="mr-2" />
						Back to Articles
					</Button>
				</Link>
				<div className="flex gap-2">
					{onEdit && (
						<Button onClick={onEdit}>
							<Edit size={16} className="mr-2" />
							Edit
						</Button>
					)}
					{onDelete && <Button onClick={onDelete}>Delete</Button>}
				</div>
			</div>

			{/* Article Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
						Article
					</span>
				</div>

				<h1 className="text-4xl font-bold">{article.title}</h1>

				{/* Article Meta */}
				<div className="flex flex-wrap items-center gap-6 text-sm">
					<div className="flex items-center gap-2">
						<User size={16} />
						<span>
							{article.user?.name || article.user?.username || "Unknown Author"}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Calendar size={16} />
						<span>
							Created {format(new Date(article.created_at), "MMM dd, yyyy")}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock size={16} />
						<span>
							Updated {format(new Date(article.updated_at), "MMM dd, yyyy")}
						</span>
					</div>
				</div>
			</div>

			{/* Article Content */}
			<div className="prose prose-invert prose-lg max-w-none">
				<div className="border-t pt-8">
					<div className="prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeHighlight]}
						>
							{article.content}
						</ReactMarkdown>
					</div>
				</div>
			</div>

			{/* Article Footer */}
			<div className="border-t pt-6">
				<div className="flex justify-between items-center">
					<div className="text-sm">Article ID: {article.id}</div>
					<div className="flex gap-2">
						{onEdit && (
							<Link to="/articles/edit/$id" params={{ id: article.id }}>
								<Button>
									<Edit size={16} className="mr-2" />
									Edit Article
								</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
