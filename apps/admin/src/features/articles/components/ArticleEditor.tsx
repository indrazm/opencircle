import { Button, Input } from "@opencircle/ui";
import MDEditor from "@uiw/react-md-editor";
import { Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import type {
	CreateArticleRequest,
	UpdateArticleRequest,
} from "../utils/types";

interface ArticleEditorProps {
	article?: Partial<CreateArticleRequest> & { id?: string };
	onSave: (data: CreateArticleRequest | UpdateArticleRequest) => Promise<void>;
	onCancel?: () => void;
	loading?: boolean;
	isEdit?: boolean;
}

export const ArticleEditor = ({
	article,
	onSave,
	onCancel,
	loading,
	isEdit = false,
}: ArticleEditorProps) => {
	const [title, setTitle] = useState(article?.title || "");
	const [content, setContent] = useState(article?.content || "");
	const [showPreview, setShowPreview] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim() || !content.trim()) {
			return;
		}

		if (isEdit && article?.id) {
			const updateData: UpdateArticleRequest = {
				id: article.id,
				title: title.trim(),
				content: content.trim(),
			};
			onSave(updateData);
		} else {
			const createData: CreateArticleRequest = {
				title: title.trim(),
				content: content.trim(),
				user_id: "", // Will be set in the route component
			};
			onSave(createData);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">
					{isEdit ? "Edit Article" : "Create New Article"}
				</h1>
				<div className="flex gap-2">
					{onCancel && (
						<Button type="button" onClick={onCancel}>
							Cancel
						</Button>
					)}
					<Button
						type="submit"
						disabled={loading || !title.trim() || !content.trim()}
					>
						<Save size={16} className="mr-2" />
						{loading ? "Saving..." : "Save"}
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<div>
						<label htmlFor="title" className="block text-sm font-medium mb-2">
							Title *
						</label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Enter article title..."
							required
						/>
					</div>

					<div>
						<div className="flex justify-between items-center mb-2">
							<label htmlFor="content" className="block text-sm font-medium">
								Content *
							</label>
							<Button
								type="button"
								size="sm"
								onClick={() => setShowPreview(!showPreview)}
							>
								{showPreview ? (
									<EyeOff size={14} className="mr-1" />
								) : (
									<Eye size={14} className="mr-1" />
								)}
								{showPreview ? "Edit" : "Preview"}
							</Button>
						</div>
						{showPreview ? (
							<div className="border border-border rounded-lg p-4 min-h-[400px] prose prose-invert max-w-none">
								<MDEditor.Markdown source={content} />
							</div>
						) : (
							<div data-color-mode="dark">
								<MDEditor
									value={content}
									onChange={(val) => setContent(val || "")}
									height={400}
									preview="edit"
									hideToolbar={false}
									visibleDragbar={false}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</form>
	);
};
