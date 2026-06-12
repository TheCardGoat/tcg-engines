import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";

export function createSimulatorQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 15_000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        networkMode: "online",
      },
    },
  });
}
