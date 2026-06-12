import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamPharact018 } from "./018-gundam-pharact.ts";

describe("Gundam Pharact (GD04-018)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04GundamPharact018.keywordEffects.map((effect) => effect.keyword)).toEqual(["Breach"]);
  });

  it("places an EX Resource when another friendly Academy Unit receives battle damage from an enemy during your turn", () => {
    const academyAttacker = createMockUnit({
      name: "Academy Attacker",
      traits: ["academy"],
      ap: 2,
      hp: 5,
    });
    const defender = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamPharact018, academyAttacker] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, academyId] = p1.getCardsInZone("battleArea");
    const [defenderId] = p2.getCardsInZone("battleArea");

    expectSuccess(engine.resolveCombat({ attackerId: academyId!, target: defenderId! }));
    if (engine.getG().pendingEffects.length > 0) {
      expectSuccess(p1.resolveEffect({}));
    }

    expect(p1.getDamage(academyId!)).toBe(2);
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const exResourceIds = p1
      .getCardsInZone("resourceArea")
      .filter((id) => framework.cards.getDefinition(id)?.name === "EX Resource");
    expect(exResourceIds).toHaveLength(1);
  });

  it("does not place an EX Resource when Pharact itself receives the damage", () => {
    const defender = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamPharact018] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [pharactId] = p1.getCardsInZone("battleArea");
    const [defenderId] = p2.getCardsInZone("battleArea");

    expectSuccess(engine.resolveCombat({ attackerId: pharactId!, target: defenderId! }));

    expect(p1.getCardsInZone("resourceArea")).toHaveLength(0);
  });
});
