import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

// We wrap the entire app in Redux Provider here, SO that theme and Store is everywhere
// but from here where does it link to
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />       {/* 🆕 changed from AppWithTheme to App */}
    </Provider>
  </React.StrictMode>
);