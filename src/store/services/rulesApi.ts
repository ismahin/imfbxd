import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export interface RuleItem {
  id: string;
  uuid: string;
  title: string;
  body: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface RulesListResponse {
  count: number;
  results: RuleItem[];
}

export interface CreateRuleRequest {
  title: string;
  body: string;
  display_order?: number;
}

const RULES_TAG = "Rules" as const;

export const rulesApi = createApi({
  reducerPath: "rulesApi",
  baseQuery,
  tagTypes: [RULES_TAG],
  endpoints: (builder) => ({
    getRules: builder.query<RulesListResponse, void>({
      query: () => ({ url: "api/web/v1/rules/list/" }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map((rule) => ({ type: RULES_TAG, id: rule.uuid })),
              { type: RULES_TAG, id: "LIST" },
            ]
          : [{ type: RULES_TAG, id: "LIST" }],
    }),

    createRule: builder.mutation<RuleItem, CreateRuleRequest>({
      query: (body) => ({
        url: "api/web/v1/rules/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: RULES_TAG, id: "LIST" }],
    }),

    deleteRule: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `api/web/v1/rules/${uuid}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, uuid) => [
        { type: RULES_TAG, id: uuid },
        { type: RULES_TAG, id: "LIST" },
      ],
    }),
  }),
});

export const { useGetRulesQuery, useCreateRuleMutation, useDeleteRuleMutation } = rulesApi;
