import {apiSlice} from './apiSlice'

const USERS_URL = '/api/v1/';

export const userApiSplice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signin: builder.mutation({
            query: (data) => ({
                url: USERS_URL+'auth/login',
                method: 'POST',
                body: data
            })
        }),
        signout: builder.mutation({
            query: () => ({
                url: USERS_URL+'auth/logout',
                method: 'POST',
            })
        })
    })
})

export const { useSigninMutation, useSignoutMutation } = userApiSplice;