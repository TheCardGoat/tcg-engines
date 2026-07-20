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
import { st06FierceUnity013 } from "./013-fierce-unity.ts";

describe("Fierce Unity (ST06-013)", () => {
  describe("【Action】Choose 1 to 2 friendly (Clan) Units. They can't receive battle damage from enemy Units that are Lv.2 or lower during this turn.", () => {
    it("protects the chosen Clan Unit from battle damage by an exactly Lv.2 enemy", () => {
      const protectedUnit = createMockUnit({ traits: ["clan"], ap: 1, hp: 5 });
      const attacker = createMockUnit({ level: 2, ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st06FierceUnity013],
          play: [{ card: protectedUnit, exhausted: true }],
          resourceArea: activeResources(3),
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
      expectSuccess(p1.playCommand(st06FierceUnity013, { targets: [protectedId] }));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(protectedId)).toBe(0);
      expect(p2.getDamage(attackerId)).toBe(1);
    });

    it("does not prevent battle damage from a Lv.3 enemy", () => {
      const protectedUnit = createMockUnit({ traits: ["clan"], ap: 1, hp: 5 });
      const attacker = createMockUnit({ level: 3, ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st06FierceUnity013],
          play: [{ card: protectedUnit, exhausted: true }],
          resourceArea: activeResources(3),
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
      expectSuccess(p1.playCommand(st06FierceUnity013, { targets: [protectedId] }));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(protectedId)).toBe(3);
    });

    it("offers one or two friendly Clan Units and excludes non-Clan and enemy Units", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st06FierceUnity013],
          play: [
            { card: createMockUnit({ traits: ["clan"] }), exhausted: true },
            createMockUnit({ traits: ["clan"] }),
            createMockUnit({ traits: ["zeon"] }),
          ],
          resourceArea: activeResources(3),
        },
        { play: [createMockUnit({ traits: ["clan"], ap: 1, hp: 5 })] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const clanIds = p1.getCardsInZone("battleArea").slice(0, 2);
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, clanIds[0]!));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(st06FierceUnity013));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: clanIds,
        minTargets: 1,
        maxTargets: 2,
      });
    });

    it("rejects a non-Clan Unit target", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st06FierceUnity013],
          play: [
            { card: createMockUnit({ traits: ["clan"] }), exhausted: true },
            createMockUnit({ traits: ["zeon"] }),
          ],
          resourceArea: activeResources(3),
        },
        { play: [createMockUnit({ ap: 1, hp: 5 })] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const clanId = p1.getCardsInZone("battleArea")[0]!;
      const nonClanId = p1.getCardsInZone("battleArea")[1]!;

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, clanId));
      expectSuccess(p1.passBlock());
      expectFailure(p1.playCommand(st06FierceUnity013, { targets: [nonClanId] }), "INVALID_TARGET");
    });
  });
});
