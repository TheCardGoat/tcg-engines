import { describe, expect, test } from "vitest";
import { playUrl } from "../../../../runtime/gameRuntimeApi.js";
import { buildReplayDataUrl } from "../../replay/fetchReplay.js";
import { buildGatewaySocketIoUrl, buildGatewayTicketUrl } from "./liveGateway.js";
import { buildMatchOverviewUrl } from "./matchContext.js";

describe("game-aware live route URL builders", () => {
  test("builds game-scoped match overview URLs", () => {
    expect(buildMatchOverviewUrl("gundam", "match 1")).toBe(
      "https://api.tcg.online/v1/games/gundam/play/matches/match%201",
    );
  });

  test("builds game-scoped quick-match and replay URLs", () => {
    expect(playUrl("lorcana", "/quick-match")).toBe(
      "https://api.tcg.online/v1/games/lorcana/play/quick-match",
    );
    expect(buildReplayDataUrl("cyberpunk", "game 1")).toBe(
      "https://api.tcg.online/v1/games/cyberpunk/play/replays/game%201",
    );
  });

  test("builds gateway ticket URLs on the game backend and socket URLs in the game namespace", () => {
    expect(buildGatewayTicketUrl("cyberpunk")).toBe("https://api.tcg.online/v1/gateway/ticket");
    expect(buildGatewaySocketIoUrl("cyberpunk")).toBe("wss://gateway.tcg.online/cyberpunk");
  });
});
