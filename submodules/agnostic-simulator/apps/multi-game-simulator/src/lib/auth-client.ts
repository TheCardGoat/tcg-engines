import { createAuthClient } from "better-auth/react";
import { gameApiBaseUrl } from "../runtime/gameRuntimeApi.ts";

export const authClient = createAuthClient({
  baseURL: gameApiBaseUrl("platform"),
  fetchOptions: {
    credentials: "include",
  },
});
