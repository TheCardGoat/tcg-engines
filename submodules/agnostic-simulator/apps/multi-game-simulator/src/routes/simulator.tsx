import { useLoaderData, useLocation, type LoaderFunctionArgs } from "react-router";
import { platformAuthSessionContext } from "../../server/context";

import App from "../App";
import { ServerAuthSessionHydrator } from "../games/cyberpunk/auth/ServerAuthSessionHydrator";

export function loader({ context }: LoaderFunctionArgs) {
  return {
    auth: context.get(platformAuthSessionContext),
  };
}

export default function SimulatorRoute() {
  const { auth } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <ServerAuthSessionHydrator auth={auth}>
      <App initialPath={location.pathname || "/"} />
    </ServerAuthSessionHydrator>
  );
}
