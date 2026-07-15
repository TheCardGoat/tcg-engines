import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04MarbetFingerhat083 } from "./083-marbet-fingerhat.ts";

describe("Marbet Fingerhat (GD04-083)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04MarbetFingerhat083] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
  });

  describe("All your (League Militaire) Unit tokens get AP+1.", () => {
    it("increases battle damage from a friendly League Militaire Unit token by 1", () => {
      const host = createMockUnit({ name: "Marbet Host" });
      const leagueMilitaireToken = createMockUnit({
        name: "League Militaire Token",
        traits: ["league militaire"],
        ap: 1,
      });
      const defender = createMockUnit({ name: "Enemy Defender", ap: 0, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04MarbetFingerhat083],
          play: [host, { card: leagueMilitaireToken, isToken: true }],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, tokenId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04MarbetFingerhat083, hostId!));
      expectSuccess(p1.enterBattle(tokenId!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(defenderId)).toBe(2);
    });

    it("does not increase battle damage from a non-token or a token without the trait", () => {
      const host = createMockUnit({ name: "Marbet Host" });
      const leagueMilitaireNonToken = createMockUnit({
        name: "League Militaire Non-Token",
        traits: ["league militaire"],
        ap: 1,
      });
      const zeonToken = createMockUnit({ name: "Zeon Token", traits: ["zeon"], ap: 1 });
      const firstDefender = createMockUnit({ name: "First Defender", ap: 0, hp: 5 });
      const secondDefender = createMockUnit({ name: "Second Defender", ap: 0, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04MarbetFingerhat083],
          play: [host, leagueMilitaireNonToken, { card: zeonToken, isToken: true }],
          resourceArea: activeResources(3),
        },
        {
          play: [
            { card: firstDefender, exhausted: true },
            { card: secondDefender, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, nonTokenId, zeonTokenId] = p1.getCardsInZone("battleArea");
      const [firstDefenderId, secondDefenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd04MarbetFingerhat083, hostId!));

      expectSuccess(p1.enterBattle(nonTokenId!, firstDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expectSuccess(p1.enterBattle(zeonTokenId!, secondDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(firstDefenderId!)).toBe(1);
      expect(p2.getDamage(secondDefenderId!)).toBe(1);
    });
  });
});
