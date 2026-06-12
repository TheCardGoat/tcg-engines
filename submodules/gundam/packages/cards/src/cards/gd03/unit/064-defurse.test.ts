import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Defurse064 } from "./064-defurse.ts";

describe("Defurse (GD03-064)", () => {
  it("【Deploy】 adds an (X-Rounder) card from trash to hand, then discards 1", () => {
    const xrounder = createMockUnit({ ap: 1, hp: 1, traits: ["x-rounder"] });
    const handFiller = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create({
      hand: [gd03Defurse064, handFiller],
      trash: [xrounder],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [xrounderId] = p1.getCardsInZone("trash");

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });
    const trashBefore = engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE });

    expectSuccess(p1.deployUnit(gd03Defurse064, { targets: [xrounderId!] }));
    while (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    }

    // Net hand size: -1 (defurse played) + 1 (x-rounder added) - 1 (discard) = -1.
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore - 1);
    // X-Rounder left the trash (discard added something else, so net could be 0 or +1).
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBeGreaterThanOrEqual(
      trashBefore,
    );
    // The X-Rounder card is no longer in the trash.
    expect(engine.getState().ctx.zones.private.cardIndex[xrounderId!]?.zoneKey).not.toBe(
      `trash:${PLAYER_ONE}`,
    );
  });
});
