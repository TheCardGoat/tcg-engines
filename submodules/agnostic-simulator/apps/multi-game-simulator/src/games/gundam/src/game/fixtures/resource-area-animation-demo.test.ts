import { describe, expect, test } from "vitest";

import { DEV_PLAYER_ONE } from "../dev-runtime.ts";
import {
  judgePlaceResource,
  loadResourceAreaAnimationDemo,
} from "./resource-area-animation-demo.ts";

describe("resource area animation fixture", () => {
  test("uses a judge action to move the top Resource and publish its native animation packet", () => {
    const dev = loadResourceAreaAnimationDemo();
    const stateBefore = dev.runtime.getState();
    const deckBefore =
      stateBefore.ctx.zones.private.zoneCards[`resourceDeck:${DEV_PLAYER_ONE}`] ?? [];
    const movedCardId = deckBefore.at(-1);

    expect(judgePlaceResource(dev.runtime)).toBe(true);

    const stateAfter = dev.runtime.getState();
    expect(stateAfter.ctx.zones.private.zoneCards[`resourceDeck:${DEV_PLAYER_ONE}`]).toHaveLength(
      9,
    );
    expect(stateAfter.ctx.zones.private.zoneCards[`resourceArea:${DEV_PLAYER_ONE}`]).toEqual([
      movedCardId,
    ]);
    expect(dev.runtime.getPacketAnimationHistory().at(-1)).toMatchObject({
      stateID: stateAfter.ctx._stateID,
      animation: {
        type: "cardMove",
        data: {
          kind: "cardMove",
          cardId: movedCardId,
          ownerId: DEV_PLAYER_ONE,
          fromZone: "resourceDeck",
          toZone: "resourceArea",
        },
      },
    });
  });
});
