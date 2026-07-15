import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd04WorldDistortion118 } from "./118-world-distortion.ts";

describe("World Distortion (GD04-118)", () => {
  describe("【Main】/【Action】If 2 or more friendly (UN) Units are in play, choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.", () => {
    function setup({ unCount = 2, enemyHp = 5, canPay = true } = {}) {
      const unUnits = Array.from({ length: unCount }, () => createMockUnit({ traits: ["un"] }));
      const enemy = createMockUnit({ hp: enemyHp });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04WorldDistortion118],
          play: unUnits,
          resourceArea: canPay ? activeResources(3) : restedResources(3),
          deck: 3,
        },
        { play: [enemy], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      return { p1, p2, commandId, enemyId };
    }

    it("returns a 5-HP enemy Unit during Main while two friendly UN Units are in play", () => {
      const { p1, p2, commandId, enemyId } = setup();

      expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));

      expect(p2.getHand()).toContain(enemyId);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("returns the enemy Unit through the end-phase Action window", () => {
      const { p1, p2, commandId, enemyId } = setup();

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));

      expect(p2.getHand()).toContain(enemyId);
    });

    it("cannot be played with fewer than two friendly UN Units", () => {
      const { p1, p2, commandId, enemyId } = setup({ unCount: 1 });

      expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "PRECONDITION_FAILED");

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot choose an enemy Unit with more than 5 HP", () => {
      const { p1, commandId, enemyId } = setup({ enemyHp: 6 });

      expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");
    });

    it("cannot be played without an active Resource for its cost", () => {
      const { p1, commandId, enemyId } = setup({ canPay: false });

      expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INSUFFICIENT_RESOURCES");
    });
  });

  it("can be paired as Alejandro Corner instead of activating the Command effect", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd04WorldDistortion118],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
  });
});
