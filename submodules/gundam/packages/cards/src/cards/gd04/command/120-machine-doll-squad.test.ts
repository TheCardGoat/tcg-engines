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
import { gd04MachineDollSquad120 } from "./120-machine-doll-squad.ts";

describe("Machine Doll Squad (GD04-120)", () => {
  describe("【Main】/【Action】Choose 1 friendly (Militia)/(Dianna Counter) Unit. It gets AP+2 during this turn.", () => {
    it("gives a chosen Militia Unit AP+2 during Main and moves the Command to trash", () => {
      const militia = createMockUnit({ ap: 2, traits: ["militia"] });
      const engine = GundamTestEngine.create({
        hand: [gd04MachineDollSquad120],
        play: [militia],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(commandId, { targets: [unitId] }));

      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("gives a chosen Dianna Counter Unit AP+2 through the end-phase Action window", () => {
      const diannaCounter = createMockUnit({ ap: 3, traits: ["dianna counter"] });
      const engine = GundamTestEngine.create({
        hand: [gd04MachineDollSquad120],
        play: [diannaCounter],
        resourceArea: activeResources(2),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId, { targets: [unitId] }));

      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5 });
    });

    it("cannot choose a friendly Unit outside both printed traits", () => {
      const other = createMockUnit({ traits: ["un"] });
      const engine = GundamTestEngine.create({
        hand: [gd04MachineDollSquad120],
        play: [other],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [unitId] }), "INVALID_TARGET");
    });

    it("cannot choose an enemy Militia Unit", () => {
      const enemyMilitia = createMockUnit({ traits: ["militia"] });
      const engine = GundamTestEngine.create(
        { hand: [gd04MachineDollSquad120], resourceArea: activeResources(2) },
        { play: [enemyMilitia] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");
    });

    it("cannot be played without an active Resource for its cost", () => {
      const militia = createMockUnit({ traits: ["militia"] });
      const engine = GundamTestEngine.create({
        hand: [gd04MachineDollSquad120],
        play: [militia],
        resourceArea: restedResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(commandId, { targets: [unitId] }), "INSUFFICIENT_RESOURCES");
    });
  });

  it("can be paired as Miashei Kune instead of activating the Command effect", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd04MachineDollSquad120],
      play: [host],
      resourceArea: activeResources(2),
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
