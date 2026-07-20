import { describe, expect, it } from "vite-plus/test";
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
import { st05WithIronAndBlood013 } from "./013-with-iron-and-blood.ts";

describe("With Iron and Blood (ST05-013)", () => {
  describe("【Main】/【Action】Choose 1 of your Units. Deal 1 damage to it. It gets AP+3 during this turn.", () => {
    it("prompts its controller for exactly one friendly Unit and applies both clauses to that Unit", () => {
      const first = createMockUnit({ name: "First", ap: 2, hp: 5 });
      const second = createMockUnit({ name: "Second", ap: 3, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy", ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05WithIronAndBlood013],
          play: [first, second],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [chosenId, otherId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: commandId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [chosenId, otherId],
      });
      expectSuccess(p1.resolveEffect({ targets: [chosenId!] }));

      expect(p1.getDamage(chosenId!)).toBe(1);
      expect(p1.getVisibleCard(chosenId!)).toMatchObject({ effectiveAp: 5 });
      expect(p1.getDamage(otherId!)).toBe(0);
      expect(p1.getVisibleCard(otherId!)).toMatchObject({ effectiveAp: 3 });
      expect(p1.getDamage(enemyId)).toBe(0);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("can be played in a legally reached Action step", () => {
      const unit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st05WithIronAndBlood013],
        play: [unit],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(st05WithIronAndBlood013, { targets: [unitId] }));

      expect(p1.getDamage(unitId)).toBe(1);
      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5 });
    });

    it("rejects an enemy Unit as the chosen target", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st05WithIronAndBlood013],
          play: [createMockUnit()],
          resourceArea: activeResources(2),
        },
        { play: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st05WithIronAndBlood013, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played without a friendly Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st05WithIronAndBlood013],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st05WithIronAndBlood013), "NO_LEGAL_TARGETS");
    });

    it("destroys a 1 HP Unit after dealing the damage", () => {
      const unit = createMockUnit({ ap: 2, hp: 1 });
      const engine = GundamTestEngine.create({
        hand: [st05WithIronAndBlood013],
        play: [unit],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st05WithIronAndBlood013, { targets: [unitId] }));

      expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("expires the AP bonus at the end of the turn", () => {
      const unit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st05WithIronAndBlood013],
        play: [unit],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st05WithIronAndBlood013, { targets: [unitId] }));
      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5 });
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 2 });
      expect(p1.getDamage(unitId)).toBe(1);
    });
  });

  it("requires Lv.2 resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st05WithIronAndBlood013],
      play: [createMockUnit()],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(st05WithIronAndBlood013), "INSUFFICIENT_RESOURCE_LEVEL");
  });

  it("requires one active resource", () => {
    const engine = GundamTestEngine.create({
      hand: [st05WithIronAndBlood013],
      play: [createMockUnit()],
      resourceArea: restedResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(st05WithIronAndBlood013), "INSUFFICIENT_RESOURCES");
  });
});
