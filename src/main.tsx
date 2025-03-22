import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "./api/client";
import { AppProvider } from "./context/AppContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppProvider>
        {" "}
        {/* ✅ Use AppProvider instead of CartProvider */}
        <App />
      </AppProvider>
    </ApolloProvider>
  </React.StrictMode>
);
