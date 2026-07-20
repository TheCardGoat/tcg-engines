import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st03TheBlueGiant014 } from "./014-the-blue-giant.ts";

describe("The Blue Giant (ST03-014)", () => {
  describe("【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle.", () => {
    it("prevents battle damage from an enemy Unit with exactly 2 AP and moves the Command to trash", () => {
      const protectedUnit = createMockUnit({ ap: 1, hp: 5 });
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03TheBlueGiant014],
          play: [{ card: protectedUnit, exhausted: true }],
          resourceArea: activeResources(4),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const protectedId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p2.enterBattle(attackerId, protectedId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(commandId, { targets: [protectedId] }));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(protectedId)).toBe(0);
      expect(p2.getDamage(attackerId)).toBe(1);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not prevent battle damage from an enemy Unit with 3 AP", () => {
      const protectedUnit = createMockUnit({ ap: 1, hp: 5 });
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03TheBlueGiant014],
          play: [{ card: protectedUnit, exhausted: true }],
          resourceArea: activeResources(4),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const protectedId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, protectedId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(st03TheBlueGiant014, { targets: [protectedId] }));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(protectedId)).toBe(3);
    });

    it("expires after that battle and does not protect the same Unit in a later battle", () => {
      const protectedUnit = createMockUnit({ ap: 0, hp: 5 });
      const firstAttacker = createMockUnit({ name: "First Attacker", ap: 2, hp: 5 });
      const secondAttacker = createMockUnit({ name: "Second Attacker", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03TheBlueGiant014],
          play: [{ card: protectedUnit, exhausted: true }],
          resourceArea: activeResources(4),
        },
        { play: [firstAttacker, secondAttacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const protectedId = p1.getCardsInZone("battleArea")[0]!;
      const [firstId, secondId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.enterBattle(firstId!, protectedId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(st03TheBlueGiant014, { targets: [protectedId] }));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getDamage(protectedId)).toBe(0);

      expectSuccess(p2.enterBattle(secondId!, protectedId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getDamage(protectedId)).toBe(2);
    });

    it("publishes only friendly Units as exact-one legal targets", () => {
      const firstFriendly = createMockUnit({ name: "First Friendly", hp: 5 });
      const secondFriendly = createMockUnit({ name: "Second Friendly", hp: 5 });
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03TheBlueGiant014],
          play: [{ card: firstFriendly, exhausted: true }, secondFriendly],
          resourceArea: activeResources(4),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyIds = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, friendlyIds[0]!));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(st03TheBlueGiant014));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected a friendly Unit choice");
      expect(choice.legalTargetIds).toEqual(friendlyIds);
      expect(choice.minTargets).toBe(1);
      expect(choice.maxTargets).toBe(1);
    });

    it("rejects an enemy Unit target", () => {
      const protectedUnit = createMockUnit({ hp: 5 });
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03TheBlueGiant014],
          play: [{ card: protectedUnit, exhausted: true }],
          resourceArea: activeResources(4),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const protectedId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, protectedId));
      expectSuccess(p1.passBlock());
      expectFailure(
        p1.playCommand(st03TheBlueGiant014, { targets: [attackerId] }),
        "INVALID_TARGET",
      );
      expect(p1.getCardZone(st03TheBlueGiant014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played when there is no legal friendly Unit", () => {
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03TheBlueGiant014],
          baseSection: [createMockBase({ hp: 5 })],
          resourceArea: activeResources(4),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectFailure(p1.playCommand(st03TheBlueGiant014), "NO_LEGAL_TARGETS");
    });

    it("cannot be played during the Main Phase", () => {
      const engine = GundamTestEngine.create({
        hand: [st03TheBlueGiant014],
        play: [createMockUnit()],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st03TheBlueGiant014), "WRONG_TIMING");
      expect(p1.getCardZone(st03TheBlueGiant014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.4 requirement", () => {
      const protectedUnit = createMockUnit({ hp: 5 });
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03TheBlueGiant014],
          play: [{ card: protectedUnit, exhausted: true }],
          resourceArea: activeResources(3),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(
        p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, p1.getCardsInZone("battleArea")[0]!),
      );
      expectSuccess(p1.passBlock());
      expectFailure(p1.playCommand(st03TheBlueGiant014), "INSUFFICIENT_RESOURCE_LEVEL");
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const protectedUnit = createMockUnit({ hp: 5 });
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03TheBlueGiant014],
          play: [{ card: protectedUnit, exhausted: true }],
          resourceArea: restedResources(4),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(
        p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, p1.getCardsInZone("battleArea")[0]!),
      );
      expectSuccess(p1.passBlock());
      expectFailure(p1.playCommand(st03TheBlueGiant014), "INSUFFICIENT_RESOURCES");
    });
  });

  describe("【Pilot】[Ramba Ral]", () => {
    it("pairs as Ramba Ral and visibly grants AP+1 and HP+1", () => {
      const host = createMockUnit({ ap: 2, hp: 3, linkCondition: "[Ramba Ral]" });
      const engine = GundamTestEngine.create({
        hand: [st03TheBlueGiant014],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
    });
  });
});
