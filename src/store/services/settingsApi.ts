import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export interface SiteSettings {
	org_name: string;
	reg_no: string;
	contact_email: string;
	contact_phone: string;
	website: string;
	address: string;
	contact_uae_address: string;
	contact_uae_phone: string;
	contact_bd_address: string;
	contact_bd_phone: string;
	footer_email: string;
	footer_phone: string;
	facebook_url: string;
	twitter_url: string;
	instagram_url: string;
	linkedin_url: string;
	primary_logo: string;
	favicon: string;
	logo_alt_text: string;
	show_logo_text: boolean;
	logo_text: string;
	hero_slider_interval: number | null;
	why_imf_title: string;
	why_imf_subtitle: string;
	why_imf_text: string;
	updated_at?: string | null;
}

export interface LogoUpdateRequest {
	primary_logo?: File;
	favicon?: File;
	logo_alt_text?: string;
	show_logo_text?: boolean;
	logo_text?: string;
}

const SETTINGS_TAG = "Settings" as const;

export const settingsApi = createApi({
	reducerPath: "settingsApi",
	baseQuery,
	tagTypes: [SETTINGS_TAG],

	endpoints: (builder) => ({
		getSettings: builder.query<SiteSettings, void>({
			query: () => ({ url: "api/web/v1/settings/" }),
			providesTags: [{ type: SETTINGS_TAG, id: "SINGLE" }],
		}),

		updateSettings: builder.mutation<SiteSettings, Partial<SiteSettings>>({
			query: (body) => ({
				url: "api/web/v1/settings/",
				method: "PATCH",
				body,
			}),
			invalidatesTags: [{ type: SETTINGS_TAG, id: "SINGLE" }],
		}),

		updateLogo: builder.mutation<SiteSettings, LogoUpdateRequest>({
			query: (body) => {
				const formData = new FormData();
				if (body.primary_logo) formData.append("primary_logo", body.primary_logo);
				if (body.favicon) formData.append("favicon", body.favicon);
				if (body.logo_alt_text !== undefined) formData.append("logo_alt_text", body.logo_alt_text);
				if (body.show_logo_text !== undefined) formData.append("show_logo_text", String(body.show_logo_text));
				if (body.logo_text !== undefined) formData.append("logo_text", body.logo_text);
				return {
					url: "api/web/v1/settings/logo",
					method: "POST",
					body: formData,
				};
			},
			invalidatesTags: [{ type: SETTINGS_TAG, id: "SINGLE" }],
		}),
	}),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation, useUpdateLogoMutation } = settingsApi;
