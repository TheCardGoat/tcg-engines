import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02HamanKarnSGazaC039 } from "./039-haman-karn-s-gaza-c.ts";
import { gd02HamanKarn091 } from "../pilot/091-haman-karn.ts";

describe("Haman Karn's Gaza C (GD02-039)", () => {
  describe("Printed Lv.3 and cost 2", () => {
    it("cannot deploy with only 2 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02HamanKarnSGazaC039],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02HamanKarnSGazaC039],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    });
  });

  it("can attack on its deployment turn after pairing the GD02 Haman Karn", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02HamanKarnSGazaC039, gd02HamanKarn091],
        resourceArea: activeResources(5),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02HamanKarnSGazaC039));
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(gd02HamanKarn091, hostId));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();

    expectSuccess(p1.enterBattle(hostId, "direct"));
  });

  it("offers only an enemy Lv.3 or lower Unit when paired and deals 1 damage", () => {
    const pilot = createMockPilot({ name: "Ple Two", traits: ["neo zeon"], cost: 1 });
    const friendlyLow = createMockUnit({ level: 3, hp: 5 });
    const enemyLow = createMockUnit({ level: 3, hp: 5 });
    const enemyHigh = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02HamanKarnSGazaC039, pilot],
        play: [friendlyLow],
        resourceArea: activeResources(3),
      },
      { play: [enemyLow, enemyHigh], shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyLowId, enemyHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02HamanKarnSGazaC039));
    const hostId = p1.getCardsInZone("battleArea")[1]!;
    expectSuccess(p1.assignPilot(pilot, hostId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyLowId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyLowId!] }));

    expect(p2.getDamage(enemyLowId!)).toBe(1);
    expect(p2.getDamage(enemyHighId!)).toBe(0);
    expect(p1.getDamage(friendlyId)).toBe(0);
  });

  it("does not publish a target choice when no enemy Unit is Lv.3 or lower", () => {
    const pilot = createMockPilot({ cost: 1 });
    const enemyHigh = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02HamanKarnSGazaC039],
        resourceArea: activeResources(3),
      },
      { play: [enemyHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });
});
