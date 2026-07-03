import { createContext } from "react-router";
import type { SessionResult } from "@tcg/shared/auth";

export const platformAuthSessionContext = createContext<SessionResult | null>(null);
