import { appApi } from './appApi';
 
const AUTH_URL = '/api/v1/auth';

export const authApi = appApi.injectEndpoints({
    endpoints: (builder) => ({
        signin: builder.mutation({
            query: (data) => ({
                url: AUTH_URL+'/login',
                method: 'POST',
                body: data
            })
        }),
        signup: builder.mutation ({
            query: (data) => ({
                url: AUTH_URL+'/signup',
                method : 'POST',
                body: data
            })
        }),
        verifyEmail: builder.mutation ({
            query: (data) => ({
                url: AUTH_URL+'/verify-email',
                method : 'POST',
                body: data
            })
        }),
        signout: builder.mutation({
            query: () => ({
                url: AUTH_URL+'/logout',
                method: 'POST',
            })
        })
    })
})

export const { 
    useSigninMutation,
    useSignoutMutation,
    useSignupMutation,
    useVerifyEmailMutation,
} = authApi;