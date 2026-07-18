import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02RickDias079 } from "./079-rick-dias.ts";

describe("Rick Dias (GD02-079)", () => {
  it("requires its printed Lv.3 and two active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02RickDias079],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02RickDias079), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02RickDias079)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02RickDias079],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02RickDias079), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02RickDias079)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("<Blocker>", () => {
    it("rests to redirect a direct attack to itself", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [gd02RickDias079], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));

      expect(p2.isExhausted(blockerId)).toBe(true);
      expect(p2.getBoardView().pendingCombat).toMatchObject({ attackerId, blockerId });
    });

    it("does not let an ordinary Unit intercept a direct attack", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const ordinaryUnit = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [ordinaryUnit], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const ordinaryUnitId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(p2.declareBlock(ordinaryUnitId), "CANNOT_BLOCK_DIRECT");

      expect(p2.isExhausted(ordinaryUnitId)).toBe(false);
    });
  });
});
