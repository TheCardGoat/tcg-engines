import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getContinuousEffects,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03Nyaan092 } from "../pilot/092-nyaan.ts";
import { gd03Gfred035 } from "./035-gfred.ts";

describe("GFreD (GD03-035)", () => {
  it("【Activate･Main】 pays 1 and exiles 1 Pilot from trash to deal 1 damage to all enemy Units", () => {
    const trashPilot = createMockPilot();
    const enemyA = createMockUnit({ hp: 4 });
    const enemyB = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        play: [gd03Gfred035],
        trash: [trashPilot],
        resourceArea: activeResources(6),
      },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashPilotId = p1.getCardsInZone("trash")[0]!;
    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(unitId, 0));

    expect(p1.getCardsInZone("trash")).not.toContain(trashPilotId);
    expect(engine.getCardsInZone({ zone: "removalArea" })).toContain(trashPilotId);
    expect(getDamageCounter(engine, enemyIds[0]!)).toBe(1);
    expect(getDamageCounter(engine, enemyIds[1]!)).toBe(1);
  });

  it("【When Linked】 can choose an active enemy Unit with AP equal to or less than this Unit", () => {
    const lowApEnemy = createMockUnit({ ap: 4 });
    const highApEnemy = createMockUnit({ ap: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Nyaan092],
        play: [gd03Gfred035],
        resourceArea: activeResources(6),
      },
      { play: [lowApEnemy, highApEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03Nyaan092, unitId));

    const grant = getContinuousEffects(engine).find(
      (effect) =>
        effect.targetId === unitId && effect.payload.kind === "grant-attack-target-option",
    );
    expect(grant?.payload).toMatchObject({
      kind: "grant-attack-target-option",
      attackTarget: {
        owner: "opponent",
        cardType: "unit",
        state: "active",
        attributeFilters: [
          { attribute: "ap", comparison: "lte", value: { ref: "source", stat: "ap" } },
        ],
      },
    });
  });
});
