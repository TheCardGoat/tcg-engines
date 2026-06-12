import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_TWO, seedShieldsFromDeck } from "@tcg/gundam-engine";
import { st07LockonStratosNeil011 } from "./011-lockon-stratos-neil.ts";

describe("Lockon Stratos (Neil) (ST07-011)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [st07LockonStratosNeil011] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("data encodes source-level attack target option", () => {
    const whenPaired = st07LockonStratosNeil011.effects?.find((effect) =>
      effect.activation.timing?.includes("whenPaired"),
    );

    expect(whenPaired?.directives[0]).toMatchObject({
      action: {
        action: "chooseAttackTarget",
        attackTarget: {
          owner: "opponent",
          cardType: "unit",
          state: "active",
          attributeFilters: [
            { attribute: "level", comparison: "lte", value: { ref: "source", stat: "level" } },
          ],
        },
      },
    });
  });
});
