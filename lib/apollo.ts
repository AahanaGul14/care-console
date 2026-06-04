'use client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';

console.log("HASURA URL:", process.env.NEXT_PUBLIC_HASURA_URL);
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_URL,
  headers: {
    'x-hasura-admin-secret':
      process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET || '',
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});