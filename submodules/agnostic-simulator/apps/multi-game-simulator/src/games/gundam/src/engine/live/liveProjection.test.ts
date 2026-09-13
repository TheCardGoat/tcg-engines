import { describe, expect, it } from "vite-plus/test";

import { gd01Gundam001 } from "@tcg/gundam-cards";
import { asPlayerId } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_ONE, DEV_PLAYER_TWO } from "../../game/dev-runtime.ts";
import { parseGundamLiveProjection } from "./liveProjection.ts";

describe("parseGundamLiveProjection", () => {
  it("accepts a server-authored viewer projection", () => {
    const server = createDevRuntime({ p2: { hand: [gd01Gundam001] } });
    const projection = server.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(DEV_PLAYER_ONE),
    });

    expect(parseGundamLiveProjection(projection)).toBe(projection);
  });

  it("rejects a raw engine snapshot", () => {
    const rawState = createDevRuntime().runtime.getState();

    expect(parseGundamLiveProjection(rawState)).toBeNull();
  });

  it("rejects a projection that reveals identity for a face-down opponent card", () => {
    const server = createDevRuntime({ p2: { hand: [gd01Gundam001] } });
    const projection = structuredClone(
      server.runtime.getFilteredView({
        role: "player",
        playerId: asPlayerId(DEV_PLAYER_ONE),
      }),
    );
    const hiddenCard = projection.zones.zones[`hand:${DEV_PLAYER_TWO}`]?.cards[0];
    expect(hiddenCard?.faceDown).toBe(true);
    if (!hiddenCard) throw new Error("Expected an opponent hand card in the fixture.");
    hiddenCard.definitionId = gd01Gundam001.cardNumber;

    expect(parseGundamLiveProjection(projection)).toBeNull();
  });
});
