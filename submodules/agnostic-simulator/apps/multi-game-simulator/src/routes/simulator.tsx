import { useLocation, useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "../root";

import App from "../App";
import { ServerAuthSessionHydrator } from "../games/cyberpunk/auth/ServerAuthSessionHydrator";

export default function SimulatorRoute() {
  const data = useRouteLoaderData<typeof rootLoader>("root");
  const auth = data?.auth ?? null;
  const location = useLocation();

  return (
    <ServerAuthSessionHydrator auth={auth}>
      <App initialPath={location.pathname || "/"} />
    </ServerAuthSessionHydrator>
  );
}
