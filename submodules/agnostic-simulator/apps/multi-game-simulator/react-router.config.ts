import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: true,
  // Lazy route discovery fetches /__manifest patches, which 404s when the
  // simulator is mounted under a reverse-proxy prefix (e.g.
  // /cyberpunk/simulator). Load the full manifest with the initial document
  // instead so no runtime manifest patch requests are needed.
  routeDiscovery: { mode: "initial" },
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
