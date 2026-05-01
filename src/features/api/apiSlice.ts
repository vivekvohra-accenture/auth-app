import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserDb } from '../../types/users';
import type { RootState } from '../../app/store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
    prepareHeaders: (headers, { getState }) => {
      // Automatically attach token if available
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<UserDb[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUserByEmail: builder.query<UserDb[], string>({
      query: (email) => `/users?email=${encodeURIComponent(email)}`,
    }),
    createUser: builder.mutation<UserDb, Partial<UserDb>>({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'], // Invalidate users list when a new user is created
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUserByEmailQuery,
  useCreateUserMutation,
} = apiSlice;
