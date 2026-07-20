import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st05AkihiroAltland011 } from "./011-akihiro-altland.ts";

describe("Akihiro Altland (ST05-011)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds the revealed Pilot card to its owner's hand when Burst is accepted", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05AkihiroAltland011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Akihiro's visible Burst choice");
      expect(burst).toMatchObject({
        controllerId: PLAYER_TWO,
        prompt: "【Burst】Add this card to your hand.",
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });

    it("moves the revealed Pilot card to trash when Burst is declined", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05AkihiroAltland011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Akihiro's visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getHand()).toHaveLength(0);
    });
  });

  describe("【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 (Tekkadan) Unit card that is Lv.2 or lower from your trash. Add it to your hand.", () => {
    it("offers exactly the eligible Tekkadan Lv.2-or-lower Unit and adds the chosen card to hand", () => {
      const host = createMockUnit({
        ap: 3,
        hp: 5,
        linkCondition: "[Akihiro Altland]",
      });
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const eligible = createMockUnit({ name: "Eligible", traits: ["tekkadan"], level: 2 });
      const wrongTrait = createMockUnit({ name: "Wrong Trait", traits: ["gjallarhorn"], level: 2 });
      const tooHigh = createMockUnit({ name: "Too High", traits: ["tekkadan"], level: 3 });
      const wrongType = createMockPilot({ name: "Wrong Type", traits: ["tekkadan"], level: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05AkihiroAltland011],
          play: [host],
          trash: [wrongTrait, tooHigh, wrongType, eligible],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const [wrongTraitId, tooHighId, wrongTypeId, eligibleId] = p1.getCardsInZone("trash");
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));
      expect(p1.getPilotId(hostId)).toBe(pilotId);
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected Akihiro to ask which eligible Unit returns from trash");
      }
      expect(choice).toMatchObject({
        controllerId: PLAYER_ONE,
        sourceCardId: pilotId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [eligibleId],
      });
      expect(choice.legalTargetIds).not.toEqual(
        expect.arrayContaining([wrongTraitId, tooHighId, wrongTypeId]),
      );
      expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("trash")).toEqual([wrongTraitId, tooHighId, wrongTypeId]);
    });

    it("does not trigger when Akihiro is paired but does not satisfy the host's Link Condition", () => {
      const host = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Other Pilot]" });
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const eligible = createMockUnit({ traits: ["tekkadan"], level: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05AkihiroAltland011],
          play: [host],
          trash: [eligible],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const eligibleId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.assignPilot(st05AkihiroAltland011, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(eligibleId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not trigger when another friendly Unit destroys the enemy Unit", () => {
      const host = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Akihiro Altland]" });
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const eligible = createMockUnit({ traits: ["tekkadan"], level: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05AkihiroAltland011],
          play: [host, attacker],
          trash: [eligible],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, attackerId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const eligibleId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.assignPilot(st05AkihiroAltland011, hostId!));
      expectSuccess(p1.enterBattle(attackerId!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(eligibleId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not trigger when the linked Unit fails to destroy the defender", () => {
      const host = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Akihiro Altland]" });
      const defender = createMockUnit({ ap: 1, hp: 6 });
      const eligible = createMockUnit({ traits: ["tekkadan"], level: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05AkihiroAltland011],
          play: [host],
          trash: [eligible],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const eligibleId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.assignPilot(st05AkihiroAltland011, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(defenderId)).toBe(4);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(eligibleId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not trigger when the linked Unit destroys an attacker during the opponent's turn", () => {
      const host = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Akihiro Altland]" });
      const attacker = createMockUnit({ ap: 1, hp: 1 });
      const eligible = createMockUnit({ traits: ["tekkadan"], level: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05AkihiroAltland011],
          play: [{ card: host, exhausted: true }],
          trash: [eligible],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [attacker], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const eligibleId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.assignPilot(st05AkihiroAltland011, hostId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(attackerId, hostId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p2.getCardZone(attackerId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(eligibleId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("resolves without a prompt when no eligible Unit exists in trash", () => {
      const host = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Akihiro Altland]" });
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05AkihiroAltland011],
          play: [host],
          trash: [createMockUnit({ traits: ["tekkadan"], level: 3 })],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st05AkihiroAltland011, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("trash")).toHaveLength(1);
    });
  });

  describe("Printed Lv.3, cost 1, AP+1, and HP+1", () => {
    it("pairs through the public command and applies its printed AP and HP bonuses", () => {
      const host = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st05AkihiroAltland011],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));

      expect(p1.getPilotId(hostId)).toBe(pilotId);
      expect(p1.getCardZone(pilotId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
    });

    it("cannot be paired below its printed Lv.3 requirement", () => {
      const host = createMockUnit();
      const engine = GundamTestEngine.create({
        hand: [st05AkihiroAltland011],
        play: [host],
        resourceArea: activeResources(2),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).assignPilot(st05AkihiroAltland011, host),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot pay its printed pairing cost without an active Resource", () => {
      const host = createMockUnit();
      const engine = GundamTestEngine.create({
        hand: [st05AkihiroAltland011],
        play: [host],
        resourceArea: activeResources(3).map((entry) => ({ ...entry, exhausted: true })),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.assignPilot(st05AkihiroAltland011, host), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st05AkihiroAltland011)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
