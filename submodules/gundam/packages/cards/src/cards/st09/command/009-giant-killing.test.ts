import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09GiantKilling009 } from "./009-giant-killing.ts";

describe("Giant Killing (ST09-009)", () => {
  describe("【Main】/【Action】Choose 1 active enemy Unit with 4 or less AP. Destroy it.", () => {
    it("destroys an active enemy unit with 4 AP", () => {
      const enemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const cmdId = p1.getHand()[0]!;
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st09GiantKilling009, { targets: [enemyId!] }));

      expect(p2.getCardZone(enemyId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("is also playable at action timing", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const battleDefender = createMockUnit({ ap: 1, hp: 5 });
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st09GiantKilling009],
          play: [attacker],
          resourceArea: activeResources(4),
        },
        { play: [{ card: battleDefender, exhausted: true }, enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId] = p1.getCardsInZone("battleArea");
      const [battleDefenderId, enemyId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.enterBattle(attackerId!, battleDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());

      expectSuccess(p1.playCommand(st09GiantKilling009, { targets: [enemyId!] }));

      expect(p2.getCardZone(enemyId!)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("cannot target an enemy unit with more than 4 AP", () => {
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st09GiantKilling009, { targets: [enemyId!] }), "INVALID_TARGET");
    });

    it("cannot target a rested enemy unit even when its AP is low enough", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st09GiantKilling009, { targets: [enemyId!] }), "INVALID_TARGET");
    });

    it("cannot target a friendly active unit", () => {
      const friendly = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st09GiantKilling009],
        resourceArea: activeResources(4),
        play: [friendly],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st09GiantKilling009, { targets: [friendlyId!] }),
        "INVALID_TARGET",
      );
    });

    it("fails cleanly when there are no legal targets", () => {
      const enemy = createMockUnit({ ap: 6, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st09GiantKilling009), "NO_LEGAL_TARGETS");
    });
  });
});
