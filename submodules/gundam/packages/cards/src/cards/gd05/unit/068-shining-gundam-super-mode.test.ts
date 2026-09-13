import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05ShiningGundamSuperMode068 } from "./068-shining-gundam-super-mode.ts";

describe("Shining Gundam (Super Mode) (GD05-068)", () => {
  /** @behavioral-proof complete: Special Move Main/Action trigger, Command trait gate, Suppression result, During Link Attack gate, and battle-only AP duration are public. */
  it("gains Suppression only when its controller activates a Special Move Command", () => {
    const specialMove = createMockCommand({
      traits: ["special move"],
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [{ action: { action: "draw", count: 1 } }],
          sourceText: "【Main】Draw 1.",
        },
      ],
    });
    const nonSpecialMove = createMockCommand({
      traits: ["mf"],
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [{ action: { action: "draw", count: 1 } }],
          sourceText: "【Main】Draw 1.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [specialMove, nonSpecialMove],
      play: [gd05ShiningGundamSuperMode068],
      resourceArea: activeResources(2),
      deck: [createMockUnit(), createMockUnit(), createMockUnit()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [specialMoveId, nonSpecialMoveId] = p1.getHand();

    expectSuccess(p1.playCommand(nonSpecialMoveId!));
    expect(p1.getVisibleCard(sourceId)?.keywords).not.toContain("Suppression");
    expectSuccess(p1.playCommand(specialMoveId!));

    expect(p1.getVisibleCard(sourceId)?.keywords).toContain("Suppression");
  });

  it("【During Link】【Attack】 gives this Unit AP+2 during the battle", () => {
    const domon = createMockPilot({ name: "Domon Kasshu" });
    const engine = GundamTestEngine.create(
      {
        hand: [domon],
        play: [gd05ShiningGundamSuperMode068],
        resourceArea: activeResources(1),
      },
      { shieldArea: [createMockUnit(), createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(domon, sourceId));
    const apBeforeBattle = p1.getVisibleCard(sourceId)?.effectiveAp;

    expectSuccess(p1.enterBattle(sourceId, "direct"));

    expect(p1.getVisibleCard(sourceId)?.effectiveAp).toBe((apBeforeBattle ?? 0) + 2);
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getVisibleCard(sourceId)?.effectiveAp).toBe(apBeforeBattle);
  });
});
