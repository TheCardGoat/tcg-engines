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
import { gd03MAVTactics106 } from "./106-m-a-v-tactics.ts";

describe("M.A.V. Tactics (GD03-106)", () => {
  it("【Main】 deploys the rested 3/2 and 2/3 Unit tokens", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03MAVTactics106],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const before = new Set(p1.getCardsInZone("battleArea"));

    expectSuccess(p1.playCommand(commandId));

    const tokenIds = p1.getCardsInZone("battleArea").filter((id) => !before.has(id));
    expect(tokenIds).toHaveLength(2);
    expect(
      tokenIds
        .map((id) => {
          const card = p1.getVisibleCard(id);
          return [card?.effectiveAp, card?.effectiveHp, card?.exhausted];
        })
        .sort((a, b) => Number(a[0]) - Number(b[0])),
    ).toEqual([
      [2, 3, true],
      [3, 2, true],
    ]);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot deploy the tokens during an Action step", () => {
    const enemyAttacker = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd03MAVTactics106], resourceArea: activeResources(6) },
      { play: [enemyAttacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectFailure(p1.playCommand(commandId), "WRONG_TIMING");

    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
