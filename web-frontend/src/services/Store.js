import React from "react";
import { createGlobalState } from "react-hooks-global-state";

const initialState = { editLayers: [] };
const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);

export { GlobalStateProvider, useGlobalState };
