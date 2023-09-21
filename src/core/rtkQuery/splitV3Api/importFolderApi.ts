import { splitV3Api } from '@/core/rtkQuery/splitV3Api';

import type { ImportFolderType } from '@/core/types/api/import-folder';

const importFolderApi = splitV3Api.injectEndpoints({
  endpoints: build => ({
    // Get import folders
    getImportFolders: build.query<ImportFolderType[], void>({
      query: () => ({ url: 'ImportFolder' }),
      providesTags: ['FileDeleted', 'FileHashed', 'FileMatched', 'ImportFolder', 'SeriesUpdated'],
    }),
    updateImportFolder: build.mutation<ImportFolderType, ImportFolderType>({
      query: folder => ({
        url: 'ImportFolder',
        method: 'PUT',
        body: folder,
      }),
      invalidatesTags: ['ImportFolder'],
    }),
    createImportFolder: build.mutation<ImportFolderType, ImportFolderType>({
      query: folder => ({
        url: 'ImportFolder',
        method: 'POST',
        body: folder,
      }),
      invalidatesTags: ['ImportFolder'],
    }),
    deleteImportFolder: build.mutation<boolean, { folderId: number, removeRecords?: boolean, updateMyList?: boolean }>({
      query: ({ folderId, ...params }) => ({
        url: `ImportFolder/${folderId}`,
        method: 'DELETE',
        params,
      }),
      invalidatesTags: ['ImportFolder'],
    }),
    rescanImportFolder: build.query<void, number>({
      query: folderId => ({ url: `ImportFolder/${folderId}/Scan` }),
    }),
  }),
});

export const {
  useCreateImportFolderMutation,
  useDeleteImportFolderMutation,
  useGetImportFoldersQuery,
  useLazyRescanImportFolderQuery,
  useUpdateImportFolderMutation,
} = importFolderApi;
