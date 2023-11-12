import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from './customFetchBase'
import { UserInterface } from '@isomera/interfaces'
import { userApi } from './user.api'
import {
  SignInWithEmailCredentialsDto,
  SignUpWithEmailCredentialsDto
} from '@isomera/dtos'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    registerUser: builder.mutation<
      UserInterface,
      typeof SignUpWithEmailCredentialsDto
    >({
      query(data) {
        return {
          url: 'auth/register',
          method: 'POST',
          body: data
        }
      },
      transformResponse: (result: { data: { user: UserInterface } }) =>
        result.data.user
    }),
    loginUser: builder.mutation<
      { access_token: string; status: string },
      typeof SignInWithEmailCredentialsDto
    >({
      query(data) {
        return {
          url: 'auth/login',
          method: 'POST',
          body: data,
          credentials: 'include'
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          await dispatch(userApi.endpoints.getMe.initiate(null))
        } catch (error) {
          console.error(error)
        }
      }
    }),
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: 'auth/logout',
          credentials: 'include'
        }
      }
    })
  })
})

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation
} = authApi
