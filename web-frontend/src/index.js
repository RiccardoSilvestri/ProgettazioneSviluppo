import React from "react";
import ReactDOM from "react-dom";

import "./styles/index.css";
import "react-leaflet-fullscreen/dist/styles.css";

import App from "./App";
import { LayerContextProvider } from "./hooks/layers.hook";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <LayerContextProvider>
        <App />
    </LayerContextProvider>
    , rootElement);
