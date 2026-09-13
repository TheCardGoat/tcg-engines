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
import { eb01MapWeapon081 } from "./081-map-weapon.ts";

describe("MAP Weapon (EB01-081)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("moves the revealed Shield to its owner's hand when Burst is accepted", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker], deck: 5 },
        { shieldArea: [eb01MapWeapon081], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(eb01MapWeapon081)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getHand()).toHaveLength(1);
    });
  });

  describe("【Main】/【Action】Choose 1 to 2 enemy Units with 2 or less HP. Return them to their owners' hands.", () => {
    it("returns exactly the two chosen eligible enemy Units during Main timing", () => {
      const firstEligible = createMockUnit({ name: "First Eligible", hp: 1 });
      const secondEligible = createMockUnit({ name: "Second Eligible", hp: 2 });
      const ineligible = createMockUnit({ name: "Ineligible", hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [eb01MapWeapon081], resourceArea: activeResources(4) },
        { play: [firstEligible, secondEligible, ineligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const [firstEligibleId, secondEligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [firstEligibleId, secondEligibleId],
        minTargets: 1,
        maxTargets: 2,
      });
      expectSuccess(p1.resolveEffect({ targets: [firstEligibleId!, secondEligibleId!] }));

      expect(p2.getHand()).toEqual(expect.arrayContaining([firstEligibleId, secondEligibleId]));
      expect(p2.getCardsInZone("battleArea")).toEqual([ineligibleId]);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("returns one eligible enemy Unit during a legally reached Action step", () => {
      const eligible = createMockUnit({ hp: 2 });
      const engine = GundamTestEngine.create(
        { hand: [eb01MapWeapon081], resourceArea: activeResources(4) },
        { play: [eligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const eligibleId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId));
      expectSuccess(p1.resolveEffect({ targets: [eligibleId] }));

      expect(p2.getCardZone(eligibleId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("rejects an enemy Unit above the printed 2-HP limit", () => {
      const eligible = createMockUnit({ hp: 2 });
      const ineligible = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [eb01MapWeapon081], resourceArea: activeResources(4) },
        { play: [eligible, ineligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const ineligibleId = p2.getCardsInZone("battleArea")[1]!;

      expectFailure(p1.playCommand(commandId, { targets: [ineligibleId] }), "INVALID_TARGET");
      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played when no eligible enemy Unit exists", () => {
      const ineligible = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [eb01MapWeapon081], resourceArea: activeResources(4) },
        { play: [ineligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(eb01MapWeapon081), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(eb01MapWeapon081)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
