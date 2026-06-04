import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://172.31.34.113:8080/v1/graphql',
  headers: {
    'x-hasura-admin-secret': 'myadminsecretkey',
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});