import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  expectFailure,
} from "@tcg/gundam-engine";
import { st01Zowort009 } from "./009-zowort.ts";

describe("Zowort (ST01-009)", () => {
  it("declares Blocker as a keyword effect", () => {
    expect(st01Zowort009.keywordEffects).toContainEqual({ keyword: "Blocker" });
  });

  it("declares cantTargetPlayer in card data", () => {
    const effects = st01Zowort009.effects?.filter((e) => e.type === "constant");
    const cantTarget = effects?.find(
      // biome-ignore lint/suspicious/noExplicitAny: card-effect union is structurally tested
      (e) => (e as any).directives?.[0]?.action?.action === "cantTargetPlayer",
    );
    expect(cantTarget).toBeDefined();
  });

  it("<Blocker> redirects an attack via keywordEffects", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 5 },
      { play: [st01Zowort009, defender], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const zowortId = p2.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[1]!;

    // Attack the defender (not Zowort).
    expectSuccess(p1.enterBattle(attackerId, defenderId));

    // Zowort should be able to block using its constant Blocker keyword.
    expectSuccess(p2.declareBlock(zowortId));
  });

  it("cantTargetPlayer restriction prevents direct attacks", () => {
    const engine = GundamTestEngine.create({ play: [st01Zowort009], deck: 5 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);

    const zowortId = p1.getCardsInZone("battleArea")[0]!;

    // Zowort should NOT be able to attack the player directly.
    expectFailure(p1.enterBattle(zowortId, "direct"), "CANNOT_TARGET_PLAYER");
  });
});
