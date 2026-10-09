import { createContext, useContext } from "react";

/** Presentation only. Prompt state, routing and commands stay in the shared components. */
export const PromptSkinContext = createContext<"v1" | "v2">("v1");
export const usePromptSkin = () => useContext(PromptSkinContext);
