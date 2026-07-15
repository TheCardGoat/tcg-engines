import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Messala003 } from "./003-messala.ts";
import { gd03AltronGundam018 } from "./018-altron-gundam.ts";

describe("Altron Gundam (GD03-018)", () => {
  it("<Breach 5> destroys the top Shield after Altron destroys an enemy Unit in battle", () => {
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const shield = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd03AltronGundam018] },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
  });

  it("【Attack】 deals 5 damage to an enemy Unit with Blocker", () => {
    const engine = GundamTestEngine.create(
      { play: [gd03AltronGundam018] },
      { play: [{ card: gd03Messala003, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, blockerId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [blockerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [blockerId] }));

    expect(engine.asPlayer(PLAYER_TWO).getCardZone(blockerId)).toBe(`trash:${PLAYER_TWO}`);
  });
});
