import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ClientLoaderFunctionArgs, LoaderFunctionArgs } from "react-router";

const resolveGatewayTicketMock = vi.hoisted(() => vi.fn());
const initRootSocketMock = vi.hoisted(() => vi.fn());
const fetchSharedSimulatorRouteDataMock = vi.hoisted(() => vi.fn());

vi.mock("../server/gateway-ticket", () => ({
  resolveGatewayTicket: resolveGatewayTicketMock,
}));

vi.mock("./lib/gateway/root-socket", () => ({
  initRootSocket: initRootSocketMock,
}));

vi.mock("./simulator/routeData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./simulator/routeData")>()),
  fetchSharedSimulatorRouteData: fetchSharedSimulatorRouteDataMock,
}));

type RootModule = typeof import("./root");

let loader: RootModule["loader"];
let clientLoader: RootModule["clientLoader"];

function makeLoaderArgs(
  url: string,
  authResult: unknown = {
    status: "session_missing",
    reason: "no_cookie",
  },
): LoaderFunctionArgs {
  return {
    request: new Request(url),
    params: {},
    context: {
      get: vi.fn(() => authResult),
    },
  } as unknown as LoaderFunctionArgs;
}

function makeClientLoaderArgs(
  serverData: Awaited<ReturnType<RootModule["loader"]>>,
): ClientLoaderFunctionArgs {
  return {
    serverLoader: vi.fn(async () => serverData),
  } as unknown as ClientLoaderFunctionArgs;
}

beforeEach(async () => {
  vi.clearAllMocks();
  initRootSocketMock.mockReturnValue(undefined);
  fetchSharedSimulatorRouteDataMock.mockResolvedValue({ matchPageData: null });
  resolveGatewayTicketMock.mockResolvedValue({
    status: "ticket_failed",
    reason: "missing_credentials",
  });
  const mod = await import("./root");
  loader = mod.loader;
  clientLoader = mod.clientLoader;
});

describe("root auth bootstrap", () => {
  it("prevents caching viewer-specific server-rendered sessions", async () => {
    const { headers } = await import("./root");
    expect(headers()).toEqual({
      "Cache-Control": "private, no-store",
      Vary: "Cookie, Authorization",
    });
  });

  it("opens the Naruto gateway namespace for multiplayer", async () => {
    const serverData = await loader(makeLoaderArgs("https://tcg.online/naruto/simulator"));

    await clientLoader(makeClientLoaderArgs(serverData));

    expect(initRootSocketMock).toHaveBeenCalledWith(
      expect.objectContaining({ gameSlug: "naruto" }),
    );
  });

  it("initializes the active Riftbound root gateway", async () => {
    const serverData = await loader(makeLoaderArgs("https://tcg.online/riftbound/simulator"));

    const clientData = await clientLoader(makeClientLoaderArgs(serverData));

    expect(initRootSocketMock).toHaveBeenCalledWith({
      session: null,
      gameSlug: "riftbound",
      ticket: undefined,
      authToken: undefined,
      requireAuth: false,
    });
    expect(clientData.rootSocketReady).toBe(true);
  });

  it("leaves live-session identity and connection ownership to the route", async () => {
    const serverData = await loader(
      makeLoaderArgs(
        "https://tcg.online/flesh-and-blood/simulator/matches/m1/games/g1?playerId=forged&ticket=forged",
      ),
    );
    expect(fetchSharedSimulatorRouteDataMock).not.toHaveBeenCalled();
    expect(resolveGatewayTicketMock).not.toHaveBeenCalled();
    expect(serverData.sessionRoute).toBe(true);
    await clientLoader(makeClientLoaderArgs(serverData));
    expect(initRootSocketMock).not.toHaveBeenCalled();
  });
});
