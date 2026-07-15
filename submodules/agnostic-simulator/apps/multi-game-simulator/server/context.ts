import { createContext } from "react-router";
import type { PlatformAuthSessionResult } from "./auth-session.js";

export const platformAuthSessionContext = createContext<PlatformAuthSessionResult>({
  status: "session_missing",
  reason: "no_cookie",
});
