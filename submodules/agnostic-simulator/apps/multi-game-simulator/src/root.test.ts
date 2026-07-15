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

vi.mock("./simulator/routeData", () => ({
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
  it("uses live-match URL gateway credentials for required root socket auth without a session", async () => {
    const serverData = await loader(
      makeLoaderArgs(
        "https://tcg.online/cyberpunk/simulator/matches/match_1/games/game_1?playerId=player_1&ticket=url_ticket&authToken=url_token",
      ),
    );

    expect(resolveGatewayTicketMock).not.toHaveBeenCalled();
    expect(serverData.authBootstrap).toMatchObject({
      status: "ready",
      requireAuth: true,
      hasSession: false,
      hasTicket: true,
      hasToken: true,
      matchId: "match_1",
      playerId: "player_1",
    });
    expect(serverData.urlGatewayCredentials).toEqual({
      ticket: "url_ticket",
      authToken: "url_token",
    });

    await clientLoader(makeClientLoaderArgs(serverData));

    expect(initRootSocketMock).toHaveBeenCalledWith({
      session: null,
      gameSlug: "cyberpunk",
      ticket: "url_ticket",
      authToken: "url_token",
      requireAuth: true,
      matchId: "match_1",
      playerId: "player_1",
    });
  });

  it("keeps required live-player routes closed when no session or URL credentials exist", async () => {
    const serverData = await loader(
      makeLoaderArgs(
        "https://tcg.online/cyberpunk/simulator/matches/match_1/games/game_1?playerId=player_1",
      ),
    );

    expect(resolveGatewayTicketMock).toHaveBeenCalledOnce();
    expect(serverData.authBootstrap).toMatchObject({
      status: "ticket_failed",
      requireAuth: true,
      hasSession: false,
      hasTicket: false,
      hasToken: false,
      matchId: "match_1",
      playerId: "player_1",
    });

    await clientLoader(makeClientLoaderArgs(serverData));

    expect(initRootSocketMock).toHaveBeenCalledWith({
      session: null,
      gameSlug: "cyberpunk",
      ticket: undefined,
      authToken: undefined,
      requireAuth: true,
      matchId: "match_1",
      playerId: "player_1",
    });
  });

  it("requires auth for seated live-match route data without a playerId query", async () => {
    fetchSharedSimulatorRouteDataMock.mockResolvedValueOnce({
      matchPageData: { viewerSeat: 0 },
    });

    const serverData = await loader(
      makeLoaderArgs("https://tcg.online/cyberpunk/simulator/matches/match_1/games/game_1"),
    );

    expect(resolveGatewayTicketMock).toHaveBeenCalledWith({
      request: expect.any(Request),
      gameSlug: "cyberpunk",
      matchId: "match_1",
      playerId: undefined,
      requireAuth: true,
    });
    expect(serverData.authBootstrap).toMatchObject({
      status: "ticket_failed",
      requireAuth: true,
      hasSession: false,
      hasTicket: false,
      hasToken: false,
      matchId: "match_1",
    });
  });

  it("does not request a player-scoped ticket for signed-in spectators", async () => {
    fetchSharedSimulatorRouteDataMock.mockResolvedValueOnce({
      matchPageData: { viewerSeat: "spectator" },
    });
    resolveGatewayTicketMock.mockResolvedValueOnce({
      status: "ready",
      ticket: { ticket: "spectator_ticket", authToken: "spectator_token" },
    });

    const serverData = await loader(
      makeLoaderArgs("https://tcg.online/cyberpunk/simulator/matches/match_1/games/game_1", {
        status: "ready",
        session: {
          session: { token: "session_token" },
          user: { id: "spectator_user" },
        },
      }),
    );

    expect(resolveGatewayTicketMock).toHaveBeenCalledWith({
      request: expect.any(Request),
      gameSlug: "cyberpunk",
      matchId: undefined,
      playerId: undefined,
      requireAuth: true,
    });
    expect(serverData.authBootstrap).toMatchObject({
      status: "ready",
      requireAuth: true,
      hasSession: true,
      hasTicket: true,
      hasToken: true,
    });

    await clientLoader(makeClientLoaderArgs(serverData));

    expect(initRootSocketMock).toHaveBeenCalledWith({
      session: { token: "session_token" },
      gameSlug: "cyberpunk",
      ticket: "spectator_ticket",
      authToken: "spectator_token",
      requireAuth: true,
      matchId: undefined,
      playerId: undefined,
    });
  });
});
