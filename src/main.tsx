import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "./api/client";
import { AppProvider } from "./context/AppContext";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppProvider>
        <App />
      </AppProvider>
    </ApolloProvider>
  </React.StrictMode>
);
