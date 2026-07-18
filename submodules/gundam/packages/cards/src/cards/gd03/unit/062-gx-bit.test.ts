import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02AwakenedPower110 } from "../../gd02/command/110-awakened-power.ts";
import { gd03GxBit062 } from "./062-gx-bit.ts";

describe("GX-Bit (GD03-062)", () => {
  it("【Deploy】if deployed from trash, deals 2 damage to an enemy Unit with 4 or less AP", () => {
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02AwakenedPower110],
        trash: [gd03GxBit062],
        resourceArea: activeResources(6),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const gxBitId = p1.getCardsInZone("trash")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd02AwakenedPower110));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [gxBitId],
    });
    expectSuccess(p1.resolveEffect({ targets: [gxBitId] }));

    expect(p1.getCardsInZone("battleArea")).toContain(gxBitId);
    expect(engine.asPlayer(PLAYER_TWO).getDamage(enemyId)).toBe(0);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p1.getCardsInZone("battleArea")).toContain(gxBitId);
    expect(engine.asPlayer(PLAYER_TWO).getDamage(enemyId)).toBe(2);
  });

  it("does not deal damage when deployed from hand", () => {
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd03GxBit062], resourceArea: activeResources(4), deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03GxBit062));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(engine.asPlayer(PLAYER_TWO).getDamage(enemyId)).toBe(0);
  });
});
