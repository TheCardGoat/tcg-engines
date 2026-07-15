import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03MesserTypeF02043 } from "./043-messer-type-f02.ts";

describe("Messer Type-F02 (GD03-043)", () => {
  it("【When Paired】 deals 1 damage to an enemy Unit", () => {
    const pilot = createMockPilot({ traits: ["mafty"] });
    const friendlyBystander = createMockUnit({ hp: 4 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03MesserTypeF02043, friendlyBystander],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [unitId, friendlyBystanderId] = p1.getCardsInZone("battleArea");
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId!));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
    expect(choice.legalTargetIds).not.toContain(friendlyBystanderId);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p1.getDamage(friendlyBystanderId!)).toBe(0);
    expect(engine.asPlayer(PLAYER_TWO).getDamage(enemyId)).toBe(1);
  });
});
