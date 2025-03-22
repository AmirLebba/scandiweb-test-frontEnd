import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  //uri: "http://localhost:8000/graphql", // Replace with your API URL
  uri: import.meta.env.VITE_BACKEND_URL + "/graphql", 
  cache: new InMemoryCache(),
});

export default client;
