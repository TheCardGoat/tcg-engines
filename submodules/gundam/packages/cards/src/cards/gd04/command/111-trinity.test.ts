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
import { gd04Trinity111 } from "./111-trinity.ts";

describe("Trinity (GD04-111)", () => {
  describe("【Main】/【Action】Choose 1 to 3 of your (CB) Units. They get AP+2 during this turn.", () => {
    it("gives the chosen friendly CB Units AP+2 during Main and moves Trinity to trash", () => {
      const cbA = createMockUnit({ name: "CB A", ap: 2, traits: ["cb"] });
      const cbB = createMockUnit({ name: "CB B", ap: 3, traits: ["cb"] });
      const other = createMockUnit({ name: "Other Unit", ap: 4, traits: ["un"] });
      const engine = GundamTestEngine.create({
        hand: [gd04Trinity111],
        play: [cbA, cbB, other],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const [cbAId, cbBId, otherId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId, { targets: [cbAId!, cbBId!] }));

      expect(p1.getVisibleCard(cbAId!)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(cbBId!)).toMatchObject({ effectiveAp: 5 });
      expect(p1.getVisibleCard(otherId!)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("gives a chosen friendly CB Unit AP+2 through the end-phase Action window", () => {
      const cbUnit = createMockUnit({ ap: 2, traits: ["cb"] });
      const engine = GundamTestEngine.create({
        hand: [gd04Trinity111],
        play: [cbUnit],
        resourceArea: activeResources(4),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId, { targets: [unitId] }));

      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot choose a friendly Unit outside the CB trait", () => {
      const nonCb = createMockUnit({ traits: ["un"] });
      const engine = GundamTestEngine.create({
        hand: [gd04Trinity111],
        play: [nonCb],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [unitId] }), "INVALID_TARGET");

      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot choose an enemy CB Unit", () => {
      const enemyCb = createMockUnit({ traits: ["cb"] });
      const engine = GundamTestEngine.create(
        { hand: [gd04Trinity111], resourceArea: activeResources(4) },
        { play: [enemyCb] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");
    });

    it("cannot choose more than three CB Units", () => {
      const cbUnits = Array.from({ length: 4 }, () => createMockUnit({ traits: ["cb"] }));
      const engine = GundamTestEngine.create({
        hand: [gd04Trinity111],
        play: cbUnits,
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectFailure(
        p1.playCommand(commandId, { targets: p1.getCardsInZone("battleArea") }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played without an active Resource for its cost", () => {
      const cbUnit = createMockUnit({ traits: ["cb"] });
      const engine = GundamTestEngine.create({
        hand: [gd04Trinity111],
        play: [cbUnit],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [unitId] }), "INSUFFICIENT_RESOURCES");
    });
  });

  it("can be paired as Johann Trinity instead of activating the Command effect", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd04Trinity111],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });
});
