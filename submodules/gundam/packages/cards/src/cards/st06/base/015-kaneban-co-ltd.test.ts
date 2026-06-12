import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st06KanebanCoLtd015 } from "./015-kaneban-co-ltd.ts";

describe("Kaneban Co., Ltd. (ST06-015)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [st06KanebanCoLtd015], resourceArea: activeResources(4), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(st06KanebanCoLtd015));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Kaneban into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st06KanebanCoLtd015] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st06KanebanCoLtd015);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("card data encodes on-link grantKeyword Breach 3 for (Clan) units", () => {
    // Verify the third effect is the whenLinked trigger with grantKeyword Breach 3
    const cardDef = st06KanebanCoLtd015;
    const linkEffect = cardDef.effects![2];
    expect(linkEffect).toBeDefined();
    const effect = linkEffect as {
      type: string;
      activation: { timing: string[]; restrictions?: Array<{ type: string }> };
      directives: Array<{ action?: Record<string, unknown> }>;
    };
    expect(effect.type).toBe("triggered");
    expect(effect.activation.timing).toContain("whenLinked");
    expect(effect.activation.restrictions).toContainEqual({ type: "oncePerTurn" });
    const directive = effect.directives[0]!;
    expect(directive.action!.action).toBe("grantKeyword");
    expect(directive.action!.keyword).toBe("Breach");
    expect(directive.action!.keywordValue).toBe(3);
    expect(directive.action!.duration).toBe("thisTurn");
  });
});
