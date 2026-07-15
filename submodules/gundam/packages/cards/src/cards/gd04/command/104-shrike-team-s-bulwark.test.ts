import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ShrikeTeamSBulwark104 } from "./104-shrike-team-s-bulwark.ts";

describe("Shrike Team's Bulwark (GD04-104)", () => {
  it("【Main】rests 2 chosen enemy Units that are Lv.2 or lower", () => {
    const enemyA = createMockUnit({ level: 2 });
    const enemyB = createMockUnit({ level: 1 });
    const engine = GundamTestEngine.create(
      { hand: [gd04ShrikeTeamSBulwark104], resourceArea: activeResources(3) },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const [enemyAId, enemyBId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(commandId, { targets: [enemyAId!, enemyBId!] }));

    expect(p2.isExhausted(enemyAId!)).toBe(true);
    expect(p2.isExhausted(enemyBId!)).toBe(true);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("【Action】rests 1 chosen enemy Unit through the end-phase action window", () => {
    const enemy = createMockUnit({ level: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd04ShrikeTeamSBulwark104], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));

    expect(p2.isExhausted(enemyId)).toBe(true);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can be paired as Junko Jenko instead of activating the Command effect", () => {
    const host = createMockUnit({ name: "Pilot Host" });
    const engine = GundamTestEngine.create({
      hand: [gd04ShrikeTeamSBulwark104],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
  });
});
