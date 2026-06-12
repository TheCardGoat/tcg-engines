import { createContext } from "react-router";
import type { SessionResult } from "../src/games/cyberpunk/auth/platform-session.js";

export const platformAuthSessionContext = createContext<SessionResult | null>(null);
