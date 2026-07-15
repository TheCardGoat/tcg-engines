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
import { gd04GundamKyriosTransAm037 } from "./037-gundam-kyrios-trans-am.ts";

describe("Gundam Kyrios (Trans-Am) (GD04-037)", () => {
  it("uses <First Strike> while a friendly red (Super Soldier) Pilot is in play", () => {
    const redSuperSoldier = createMockPilot({ color: "red", traits: ["super soldier"] });
    const defender = createMockUnit({ name: "Lethal Defender", ap: 6, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [redSuperSoldier],
        play: [gd04GundamKyriosTransAm037],
        resourceArea: activeResources(1),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(redSuperSoldier, unitId));
    expectSuccess(p1.enterBattle(unitId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getDamage(unitId)).toBe(0);
  });

  it("uses <Breach 3> while a friendly green (Super Soldier) Pilot is in play", () => {
    const greenSuperSoldier = createMockPilot({ color: "green", traits: ["super soldier"] });
    const defender = createMockUnit({ name: "Enemy Defender", ap: 0, hp: 5 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [greenSuperSoldier],
        play: [gd04GundamKyriosTransAm037],
        resourceArea: activeResources(1),
      },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.assignPilot(greenSuperSoldier, unitId));
    expectSuccess(p1.enterBattle(unitId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("does not gain either keyword without a matching (Super Soldier) Pilot in play", () => {
    const nonSuperSoldier = createMockPilot({ color: "red", traits: ["cb"] });
    const engine = GundamTestEngine.create({
      hand: [nonSuperSoldier],
      play: [gd04GundamKyriosTransAm037],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(nonSuperSoldier, unitId));

    expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("FirstStrike");
    expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("Breach");
  });
});
