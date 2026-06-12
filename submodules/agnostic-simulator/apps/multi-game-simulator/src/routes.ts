import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/simulator.tsx"),
  route("*", "routes/simulator-splat.tsx"),
] satisfies RouteConfig;
