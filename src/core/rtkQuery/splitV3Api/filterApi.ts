import { defaultSerializeQueryArgs } from '@reduxjs/toolkit/query';
import { omit } from 'lodash';

import { splitV3Api } from '@/core/rtkQuery/splitV3Api';

import type { InfiniteResultType, ListResultType, PaginationType } from '@/core/types/api';
import type { CollectionGroupType } from '@/core/types/api/collection';
import type { FilterType } from '@/core/types/api/filter';
import type { SeriesType } from '@/core/types/api/series';

const filterApi = splitV3Api.injectEndpoints({
  endpoints: build => ({
    getFilter: build.query<FilterType, { filterId: string }>({
      query: ({ filterId }) => ({
        url: `Filter/${filterId}`,
        params: {
          withConditions: true,
        },
      }),
    }),
    getFilteredGroupsInfinite: build.query<
      InfiniteResultType<CollectionGroupType[]>,
      PaginationType & { randomImages?: boolean, filterCriteria: FilterType }
    >({
      query: ({ filterCriteria, ...params }) => ({
        url: 'Filter/Preview/Group',
        method: 'POST',
        params,
        body: filterCriteria,
      }),
      transformResponse: (response: ListResultType<CollectionGroupType[]>, _, args) => ({
        pages: {
          [args.page ?? 1]: response.List,
        },
        total: response.Total,
      }),
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ endpointDefinition, endpointName, queryArgs }) =>
        defaultSerializeQueryArgs({
          endpointName,
          queryArgs: omit(queryArgs, ['page']),
          endpointDefinition,
        }),
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        const tempCache = { ...currentCache };
        tempCache.pages = { ...currentCache.pages, ...newItems.pages };
        return tempCache;
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getFilteredGroupSeries: build.query<
      InfiniteResultType<SeriesType[]>,
      { groupId: string, randomImages?: boolean, filterCriteria: FilterType }
    >({
      query: ({ filterCriteria, groupId, ...params }) => ({
        url: `Filter/Preview/Group/${groupId}/Series`,
        method: 'POST',
        params,
        body: filterCriteria,
      }),
      transformResponse: (response: SeriesType[]) => ({
        pages: {
          1: response,
        },
        total: response.length,
      }),
    }),
  }),
});

export const {
  useGetFilterQuery,
  useGetFilteredGroupSeriesQuery,
  useGetFilteredGroupsInfiniteQuery,
} = filterApi;