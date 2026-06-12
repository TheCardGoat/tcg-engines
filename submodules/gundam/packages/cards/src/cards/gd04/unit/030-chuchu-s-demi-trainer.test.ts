import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ChuchuSDemiTrainer030 } from "./030-chuchu-s-demi-trainer.ts";

describe("Chuchu's Demi Trainer (GD04-030)", () => {
  it("【Attack】 grants the chosen friendly (Academy) Unit a grant-attack-target-option for this turn", () => {
    const ally = createMockUnit({ ap: 2, hp: 3, traits: ["academy"] });
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      { play: [gd04ChuchuSDemiTrainer030, ally] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chuchuId, allyId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(chuchuId!, defenderId));
    while (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [allyId!] }));
    }

    // Filter `excludeSource: true` + `trait: academy` makes the ally the
    // only legal candidate, so the directive must bind to it (not Chuchu)
    // and the duration matches the printed "during this turn" wording.
    const grantOnAlly = engine
      .getG()
      .continuousEffects.find(
        (e) => e.targetId === allyId && e.payload.kind === "grant-attack-target-option",
      );
    expect(grantOnAlly).toBeDefined();
    expect(grantOnAlly?.duration).toBe("this-turn");

    // Chuchu (the source) must NOT receive the grant — `excludeSource`
    // removes it from the candidate set.
    const grantOnChuchu = engine
      .getG()
      .continuousEffects.find(
        (e) => e.targetId === chuchuId && e.payload.kind === "grant-attack-target-option",
      );
    expect(grantOnChuchu).toBeUndefined();
  });
});
