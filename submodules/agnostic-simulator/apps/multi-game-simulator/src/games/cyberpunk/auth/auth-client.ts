import { createAuthClient } from "better-auth/react";
import { getAuthBaseUrl } from "./config";

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  fetchOptions: {
    credentials: "include",
  },
});
