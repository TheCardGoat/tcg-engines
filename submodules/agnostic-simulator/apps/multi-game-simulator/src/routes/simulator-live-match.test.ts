import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ClientLoaderFunctionArgs } from "react-router";
import { MatchSessionSchema } from "@tcg/game-page-contract";

const socket = vi.hoisted(() => ({ initRootSocket: vi.fn(), destroyRootSocket: vi.fn() }));
vi.mock("../lib/gateway/root-socket", () => socket);
vi.mock("./simulator-route-module", async () => ({
  ...(await import("./simulator-route-loader")),
  SimulatorRouteModule: () => null,
}));
import { clientLoader } from "./simulator-live-match";
import { clientLoader as landingClientLoader } from "./simulator-match-landing";

const permissions = {
  act: false,
  chat: false,
  propose: false,
  useManualControls: false,
  concede: false,
  spectate: true,
  viewReplay: false,
  downloadReplay: false,
  forkReplay: false,
};
function session(role: "player" | "spectator") {
  return MatchSessionSchema.parse({
    schemaVersion: 2,
    phase: "starting",
    revision: 1,
    gameId: "g1",
    match: {
      matchId: "m1",
      gameType: "flesh-and-blood",
      format: "best_of_1",
      matchType: "casual",
      status: "waiting",
      participants: [],
      gameIds: [],
    },
    viewer:
      role === "player"
        ? { role, actorId: "p1", userId: "u1", seat: 1, permissions }
        : { role, spectatorId: "s1", permissions },
    realtime: {
      ticket: `${role}-ticket`,
      reconnectToken: `${role}-token`,
      wsUrl: "ws://localhost",
      expiresAt: "2026-09-04T12:00:00.000Z",
      protocolVersion: 2,
    },
  });
}
function args(value: unknown): ClientLoaderFunctionArgs {
  return { serverLoader: async () => value } as ClientLoaderFunctionArgs;
}
beforeEach(() => vi.clearAllMocks());
describe("live route socket ownership", () => {
  it.each(["player", "spectator"] as const)("seeds the server-selected %s scope", async (role) => {
    await clientLoader(args({ gameSlug: "flesh-and-blood", session: session(role) }));
    expect(socket.initRootSocket).toHaveBeenCalledWith({
      expiresAt: "2026-09-04T12:00:00.000Z",
      gameSlug: "flesh-and-blood",
      session: null,
      matchId: "m1",
      gameId: "g1",
      playerId: role === "player" ? "p1" : undefined,
      ticket: `${role}-ticket`,
      authToken: `${role}-token`,
      requireAuth: true,
    });
  });
  it.each([null, { ...session("spectator"), realtime: undefined }])(
    "clears the previous scope when realtime access is absent",
    async (next) => {
      await clientLoader(args({ gameSlug: "flesh-and-blood", session: session("player") }));
      await clientLoader(args({ gameSlug: "flesh-and-blood", session: next }));
      expect(socket.destroyRootSocket).toHaveBeenCalledTimes(1);
    },
  );
  it("clears the previous scope for an unresolved match landing", async () => {
    await landingClientLoader(args({ gameSlug: "flesh-and-blood", session: null }));
    expect(socket.destroyRootSocket).toHaveBeenCalledTimes(1);
  });
  it("clears the previous scope when navigation fails before receiving a session", async () => {
    const failure = new Error("Network unavailable");
    await expect(
      clientLoader({
        ...args(undefined),
        serverLoader: async () => {
          throw failure;
        },
      }),
    ).rejects.toBe(failure);
    expect(socket.destroyRootSocket).toHaveBeenCalledTimes(1);
  });
});
