import { describe, expect, it } from "vitest";
import {
  MatchSessionSchema,
  acceptSession,
  liveGameFromSession,
  type MatchSession,
} from "./session";

const permissions = {
  act: true,
  chat: true,
  propose: false,
  useManualControls: false,
  concede: true,
  spectate: false,
  viewReplay: true,
  downloadReplay: true,
  forkReplay: false,
};
const base = {
  schemaVersion: 2,
  revision: 3,
  match: {
    matchId: "m1",
    gameType: "flesh-and-blood",
    format: "best_of_1",
    matchType: "casual",
    status: "waiting",
    participants: [],
    gameIds: ["g1"],
  },
  viewer: { role: "player", actorId: "p1", seat: 1, userId: "u1", permissions },
};
function preparation(revision = 3): MatchSession {
  return MatchSessionSchema.parse({
    ...base,
    revision,
    phase: "preparation",
    gameId: "g1",
    preparation: {
      object: "game_pregame",
      kind: "flesh-and-blood",
      matchId: "m1",
      gameId: "g1",
      status: "waiting",
      playerId: "p1",
      deadlineAt: "2026-09-04T12:00:00.000Z",
      turnOrder: { stage: "choosing", chooserId: "p1" },
      pool: {},
      selection: {},
      player: { playerId: "p1", label: "Player" },
      opponent: { playerId: "p2", label: "Opponent" },
      locked: false,
      opponentReady: false,
    },
  });
}
function playing(version = 4, revision = 4): MatchSession {
  return MatchSessionSchema.parse({
    ...base,
    revision,
    phase: "playing",
    match: { ...base.match, status: "in_progress" },
    game: {
      gameId: "g1",
      gameNumber: 1,
      status: "in_progress",
      authority: "server",
      stateVersion: version,
      view: { viewer: "p1" },
    },
    capabilities: {
      actions: true,
      chat: true,
      proposals: false,
      manualControls: false,
      spectating: false,
      conceding: true,
      replay: false,
    },
    presence: { players: [] },
    history: { recentMoves: [], engineLogs: [] },
  });
}
describe("viewer match sessions", () => {
  it("rejects an active game presented as preparation", () => {
    expect(
      MatchSessionSchema.safeParse({
        ...preparation(),
        match: { ...base.match, status: "in_progress" },
      }).success,
    ).toBe(false);
  });
  it("requires an actual preparation payload", () => {
    expect(
      MatchSessionSchema.safeParse({ ...base, phase: "preparation", gameId: "g1" }).success,
    ).toBe(false);
  });
  it.each([null, "waiting", [], {}, { pool: null }])(
    "rejects malformed preparation %j",
    (payload) => {
      expect(MatchSessionSchema.safeParse({ ...preparation(), preparation: payload }).success).toBe(
        false,
      );
    },
  );
  it("rejects retained preparation in a playing response", () => {
    expect(
      MatchSessionSchema.safeParse({ ...playing(), preparation: { owner: "p1" } }).success,
    ).toBe(false);
  });
  it("does not require an initialized engine during preparation", () => {
    expect(preparation().phase).toBe("preparation");
    expect(liveGameFromSession(preparation())).toBeNull();
  });
  it("projects the active game without lifecycle fields", () => {
    const game = liveGameFromSession(playing());
    expect(game?.game.stateVersion).toBe(4);
    expect(game).not.toHaveProperty("preparation");
    expect(game).not.toHaveProperty("phase");
    expect(game).not.toHaveProperty("revision");
  });
  it("rejects delayed preparation after the match starts", () => {
    const current = playing();
    expect(acceptSession(current, preparation())).toBe(current);
    expect(acceptSession(current, preparation(4))).toBe(current);
  });
  it("never regresses game versions within one lifecycle revision", () => {
    const current = playing(10);
    expect(acceptSession(current, playing(9))).toBe(current);
    expect(acceptSession(current, playing(11))).toEqual(playing(11));
  });
  it("accepts a newer preparation lifecycle for the next game", () => {
    const pending = preparation(5);
    if (pending.phase !== "preparation") throw new Error("Expected preparation");
    const next = MatchSessionSchema.parse({
      ...pending,
      gameId: "g2",
      preparation: { ...pending.preparation, gameId: "g2" },
      match: { ...base.match, gameIds: ["g1", "g2"] },
    });
    expect(acceptSession(playing(), next)).toEqual(next);
  });
  it("rejects preparation belonging to a different viewer or game", () => {
    const pending = preparation();
    if (pending.phase !== "preparation") throw new Error("Expected preparation");
    for (const changes of [{ playerId: "p2" }, { gameId: "g2" }, { matchId: "m2" }]) {
      expect(
        MatchSessionSchema.safeParse({
          ...pending,
          preparation: { ...pending.preparation, ...changes },
        }).success,
      ).toBe(false);
    }
  });
  it("does not regress a game version even when match metadata advances", () => {
    const current = playing(10);
    expect(acceptSession(current, playing(9, 5))).toBe(current);
  });
  it("rejects responses for a different match", () => {
    const current = playing();
    expect(acceptSession(current, { ...current, match: { ...current.match, matchId: "m2" } })).toBe(
      current,
    );
  });
});
