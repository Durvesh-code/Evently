import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ModalProvider } from "./context/ModalContext.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const initialPayPalOptions = {
  "client-id":
    "AYDTHKEnUK1FqlsJc2O3wu5dyfzDvWYaQNj9p3rEtskEqnHFv-8KrRxymqsfcvKv4r8v6JLXbvuJFJAF",
  // --- CHANGE THIS TO INR ---
  currency: "USD",
  intent: "capture",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <PayPalScriptProvider options={initialPayPalOptions}>
            <App />
          </PayPalScriptProvider>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
