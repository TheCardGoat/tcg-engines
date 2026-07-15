import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GearaDogaHeavyArmedType053 } from "./053-geara-doga-heavy-armed-type.ts";

describe("Geara Doga (Heavy Armed Type) (GD01-053)", () => {
  it("offers only enemy Units with 2 or less AP, pays 1, and damages the chosen Unit", () => {
    const eligible = createMockUnit({ ap: 2, hp: 5 });
    const tooStrong = createMockUnit({ ap: 3, hp: 5 });
    const friendly = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [gd01GearaDogaHeavyArmedType053, friendly],
        resourceArea: activeResources(2),
      },
      { play: [eligible, tooStrong] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, tooStrongId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(sourceId, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getDamage(eligibleId!)).toBe(1);
    expect(p2.getDamage(tooStrongId!)).toBe(0);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    expectFailure(p1.activateAbility(sourceId, 0), "ABILITY_LIMIT_REACHED");
  });

  it("cannot activate without an active Resource", () => {
    const enemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd01GearaDogaHeavyArmedType053] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.activateAbility(sourceId, 0, { targets: [enemyId] }),
      "INSUFFICIENT_RESOURCES",
    );

    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
