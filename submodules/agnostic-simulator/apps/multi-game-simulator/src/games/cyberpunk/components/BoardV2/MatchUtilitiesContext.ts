import { createContext, type ReactNode } from "react";

/** Places the shared match controls in the board header without duplicating actions. */
export const MatchUtilitiesContext = createContext<ReactNode>(null);
