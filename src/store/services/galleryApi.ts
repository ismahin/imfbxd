import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export type GallerySection = "Hero" | "Objectives" | "Gallery";
export const GALLERY_SECTIONS: GallerySection[] = ["Hero", "Objectives", "Gallery"];

export interface GalleryItem {
	id: string;
	uuid: string;
	title: string;
	category: GallerySection;
	date?: string;
	url: string;
	alt: string;
	created_at?: string;
}

export interface GalleryListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: GalleryItem[];
}

export interface CreateGalleryRequest {
	title: string;
	category?: GallerySection;
	date?: string;
	alt?: string;
	image?: File;
}

const GALLERY_TAG = "Gallery" as const;

export const galleryApi = createApi({
	reducerPath: "galleryApi",
	baseQuery,
	tagTypes: [GALLERY_TAG],

	endpoints: (builder) => ({
		getGallery: builder.query<
			GalleryListResponse,
			{ limit?: number; offset?: number; category?: GallerySection | "All" } | void
		>({
			query: (params) => ({
				url: "api/web/v1/gallery/list/",
				params: {
					limit: params?.limit ?? 100,
					offset: params?.offset ?? 0,
					...(params?.category && params.category !== "All" && { category: params.category }),
				},
			}),
			providesTags: (result) =>
				result
					? [
							...result.results.map((item) => ({ type: GALLERY_TAG, id: item.uuid })),
							{ type: GALLERY_TAG, id: "LIST" },
						]
					: [{ type: GALLERY_TAG, id: "LIST" }],
		}),

		getGalleryItem: builder.query<GalleryItem, string>({
			query: (uuid) => ({ url: `api/web/v1/gallery/${uuid}/` }),
			providesTags: (_result, _err, uuid) => [{ type: GALLERY_TAG, id: uuid }],
		}),

		createGallery: builder.mutation<GalleryItem, CreateGalleryRequest>({
			query: (body) => {
				const formData = new FormData();
				formData.append("title", body.title);
				if (body.category) formData.append("category", body.category);
				if (body.date) formData.append("date", body.date);
				if (body.alt) formData.append("alt", body.alt);
				if (body.image) formData.append("image", body.image);
				return {
					url: "api/web/v1/gallery/",
					method: "POST",
					body: formData,
					// FormData: do not set Content-Type; browser sets multipart boundary
				};
			},
			invalidatesTags: [{ type: GALLERY_TAG, id: "LIST" }],
		}),

		updateGallery: builder.mutation<
			GalleryItem,
			{ uuid: string; body: Partial<CreateGalleryRequest>; image?: File }
		>({
			query: ({ uuid, body, image }) => {
				const formData = new FormData();
				if (body.title != null) formData.append("title", body.title);
				if (body.category != null) formData.append("category", body.category);
				if (body.date !== undefined) formData.append("date", body.date ?? "");
				if (body.alt !== undefined) formData.append("alt", body.alt ?? "");
				if (image) formData.append("image", image);
				return {
					url: `api/web/v1/gallery/${uuid}/`,
					method: "PATCH",
					body: formData,
				};
			},
			invalidatesTags: (_result, _err, { uuid }) => [
				{ type: GALLERY_TAG, id: uuid },
				{ type: GALLERY_TAG, id: "LIST" },
			],
		}),

		deleteGallery: builder.mutation<void, string>({
			query: (uuid) => ({
				url: `api/web/v1/gallery/${uuid}/`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _err, uuid) => [
				{ type: GALLERY_TAG, id: uuid },
				{ type: GALLERY_TAG, id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetGalleryQuery,
	useGetGalleryItemQuery,
	useCreateGalleryMutation,
	useUpdateGalleryMutation,
	useDeleteGalleryMutation,
} = galleryApi;
