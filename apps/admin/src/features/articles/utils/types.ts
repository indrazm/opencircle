import type { Post } from "@opencircle/core";

export interface Article extends Post {
	title?: string;
}

export interface CreateArticleRequest {
	title: string;
	content: string;
	user_id: string;
	channel_id?: string;
	files?: File[];
}

export interface UpdateArticleRequest {
	id: string;
	title?: string;
	content?: string;
}

export interface ArticleFilters {
	user_id?: string;
	search?: string;
}
