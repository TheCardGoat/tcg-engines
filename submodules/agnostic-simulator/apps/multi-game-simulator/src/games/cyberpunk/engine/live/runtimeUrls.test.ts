import { describe, expect, test } from "vitest";
import { playUrl } from "../../../../runtime/gameRuntimeApi.js";
import { buildReplayDataUrl } from "../../replay/fetchReplay.js";
import { buildGatewaySocketIoUrl, buildGatewayTicketUrl } from "./liveGateway.js";
import { buildMatchContextUrl, buildMatchOverviewUrl } from "./matchContext.js";

describe("game-aware live route URL builders", () => {
  test("builds game-scoped match overview and context URLs", () => {
    expect(buildMatchOverviewUrl("gundam", "match 1")).toBe(
      "https://gundam-api.tcg.online/v1/games/gundam/play/matches/match%201",
    );
    expect(buildMatchContextUrl("one-piece", "match 1", "game/2")).toBe(
      "https://one-piece-api.tcg.online/v1/games/one-piece/play/matches/match%201/games/game%2F2/context",
    );
  });

  test("builds game-scoped quick-match and replay URLs", () => {
    expect(playUrl("lorcana", "/quick-match")).toBe(
      "https://lorcana-api.tcg.online/v1/games/lorcana/play/quick-match",
    );
    expect(buildReplayDataUrl("cyberpunk", "game 1")).toBe(
      "https://cyberpunk-api.tcg.online/v1/games/cyberpunk/play/replays/game%201/data",
    );
  });

  test("builds gateway ticket URLs on the game backend and socket URLs in the game namespace", () => {
    expect(buildGatewayTicketUrl("cyberpunk")).toBe(
      "https://cyberpunk-api.tcg.online/v1/gateway/ticket",
    );
    expect(buildGatewaySocketIoUrl("cyberpunk")).toBe("wss://gateway.tcg.online/cyberpunk");
  });
});
