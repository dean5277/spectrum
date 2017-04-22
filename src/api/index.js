// @flow
import { ApolloClient, createNetworkInterface } from 'react-apollo';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3001/',
});

export const client = new ApolloClient({
  networkInterface,
});