import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { restUnitsByAttackingDirectly } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { eb01GundamPixy019 } from "./019-gundam-pixy.ts";

describe("Gundam Pixy (EB01-019)", () => {
  it("【Attack】 gains High-Maneuver after two other Units are legally rested", () => {
    const first = createMockUnit({ name: "First Attacker" });
    const second = createMockUnit({ name: "Second Attacker" });
    const blocker = createMockUnit({
      name: "Enemy Blocker",
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { play: [eb01GundamPixy019, first, second] },
      {
        play: [blocker],
        shieldArea: [
          createMockUnit({ name: "First Shield" }),
          createMockUnit({ name: "Second Shield" }),
          createMockUnit({ name: "Third Shield" }),
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [pixyId, firstId, secondId] = p1.getCardsInZone("battleArea");
    const blockerId = p2.getCardsInZone("battleArea")[0]!;
    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [firstId!, secondId!]);

    expectSuccess(p1.enterBattle(pixyId!, "direct"));

    expect(p1.getVisibleCard(pixyId!)?.keywords).toContain("HighManeuver");
    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
  });

  it("remains blockable when fewer than two other Units are rested", () => {
    const otherUnit = createMockUnit({ name: "Other Attacker" });
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      { play: [eb01GundamPixy019, otherUnit] },
      { play: [blocker], shieldArea: [createMockUnit({ name: "Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [pixyId, otherUnitId] = p1.getCardsInZone("battleArea");
    const blockerId = p2.getCardsInZone("battleArea")[0]!;
    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [otherUnitId!]);

    expectSuccess(p1.enterBattle(pixyId!, "direct"));
    expect(p1.getVisibleCard(pixyId!)?.keywords).not.toContain("HighManeuver");
    expectSuccess(p2.declareBlock(blockerId));
  });
});
