import type { Resource } from "@opencircle/core";

export interface CreateResourceRequest {
	url: string;
	description?: string;
	user_id: string;
	channel_id: string;
}

export interface UpdateResourceRequest {
	url?: string;
	description?: string;
}

export interface ResourceFilters {
	channel_id?: string;
	user_id?: string;
	search?: string;
}

export type { Resource };
