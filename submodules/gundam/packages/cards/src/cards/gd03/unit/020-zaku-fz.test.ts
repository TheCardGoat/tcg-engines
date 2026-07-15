import { describe, it, expect } from "vite-plus/test";
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
import { gd01MidairModifications121 } from "../../gd01/command/121-midair-modifications.ts";
import { gd03AwakenedPotential118 } from "../command/118-awakened-potential.ts";
import { gd03BernardWiseman089 } from "../pilot/089-bernard-wiseman.ts";
import { gd03ZakuFz020 } from "./020-zaku-fz.ts";

describe("Zaku II FZ (GD03-020)", () => {
  it("【When Paired】 deploys 2 rested Ad Balloon tokens with 4+ Cyclops Team cards in trash", () => {
    const trash = Array.from({ length: 4 }, () => createMockUnit({ traits: ["cyclops team"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [gd03BernardWiseman089],
        play: [gd03ZakuFz020],
        trash,
        resourceArea: activeResources(2),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03BernardWiseman089, zakuId));

    const pilotId = p1.getPilotId(zakuId);
    const tokens = p1.getCardsInZone("battleArea").filter((id) => id !== zakuId && id !== pilotId);
    expect(tokens).toHaveLength(2);
    for (const tokenId of tokens) {
      expect(p1.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 0,
        effectiveHp: 1,
        exhausted: true,
      });
    }
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("【When Paired】 does not deploy tokens with fewer than 4 Cyclops Team cards in trash", () => {
    const trash = Array.from({ length: 3 }, () => createMockUnit({ traits: ["cyclops team"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [gd03BernardWiseman089],
        play: [gd03ZakuFz020],
        trash,
        resourceArea: activeResources(2),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03BernardWiseman089, zakuId));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
  });

  it("does not allow a Pilot to be paired with an Ad Balloon token", () => {
    const extraPilot = createMockPilot({ cost: 1, level: 1 });
    const trash = Array.from({ length: 4 }, () => createMockUnit({ traits: ["cyclops team"] }));
    const engine = GundamTestEngine.create({
      hand: [gd03BernardWiseman089, extraPilot],
      play: [gd03ZakuFz020],
      trash,
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03BernardWiseman089, zakuId));
    const pilotId = p1.getPilotId(zakuId);
    const tokenId = p1.getCardsInZone("battleArea").find((id) => id !== zakuId && id !== pilotId);
    expect(tokenId).toBeDefined();

    expectFailure(p1.assignPilot(extraPilot, tokenId!), "UNIT_CANNOT_PAIR_PILOT");
  });

  it("keeps Ad Balloon tokens rested through their controller's next Start Phase", () => {
    const trash = Array.from({ length: 4 }, () => createMockUnit({ traits: ["cyclops team"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [gd03BernardWiseman089],
        play: [gd03ZakuFz020],
        trash,
        resourceArea: activeResources(4),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03BernardWiseman089, zakuId));
    const pilotId = p1.getPilotId(zakuId);
    const tokenId = p1.getCardsInZone("battleArea").find((id) => id !== zakuId && id !== pilotId);
    expect(tokenId).toBeDefined();
    expect(p1.isExhausted(tokenId!)).toBe(true);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expect(p1.isExhausted(tokenId!)).toBe(true);
  });

  it("keeps an Ad Balloon rested when an effect tries to set it active", () => {
    const cyclopsTeamTrash = Array.from({ length: 4 }, () =>
      createMockUnit({ traits: ["cyclops team"] }),
    );
    const battleTarget = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03BernardWiseman089, gd03AwakenedPotential118, gd01MidairModifications121],
        play: [gd03ZakuFz020],
        trash: [gd03AwakenedPotential118, gd03AwakenedPotential118, ...cyclopsTeamTrash],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [{ card: battleTarget, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;
    const [bernardId, awakenedPotentialId, midairModificationsId] = p1.getHand();
    const battleTargetId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(bernardId!, zakuId));
    const pilotId = p1.getPilotId(zakuId);
    const adBalloonId = p1
      .getCardsInZone("battleArea")
      .find((id) => id !== zakuId && id !== pilotId);
    expect(adBalloonId).toBeDefined();

    expectSuccess(p1.enterBattle(zakuId, battleTargetId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(
      p1.playCommand(awakenedPotentialId!, { targets: [battleTargetId, adBalloonId!] }),
    );
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.playCommand(midairModificationsId!, { targets: [adBalloonId!] }));

    expect(p1.getVisibleCard(adBalloonId!)).toMatchObject({ exhausted: true });
    expect(p1.getCardZone(midairModificationsId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  describe('While you have a Unit with "Ad Balloon" in its card name in play, this Unit can\'t receive enemy battle damage.', () => {
    it("prevents enemy battle damage while one of its Ad Balloon tokens is in play", () => {
      const trash = Array.from({ length: 4 }, () => createMockUnit({ traits: ["cyclops team"] }));
      const enemy = createMockUnit({ name: "Enemy Attacker", ap: 4, hp: 6 });
      const defender = createMockUnit({ name: "Transition Defender", ap: 0, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03BernardWiseman089],
          play: [gd03ZakuFz020],
          trash,
          resourceArea: activeResources(4),
          deck: 5,
        },
        { play: [enemy, { card: defender, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const [enemyId, defenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd03BernardWiseman089, zakuId));
      expectSuccess(p1.enterBattle(zakuId, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expectSuccess(p2.enterBattle(enemyId!, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getDamage(zakuId)).toBe(0);
      expect(p2.getDamage(enemyId!)).toBe(1);
    });

    it("receives enemy battle damage normally without a friendly Ad Balloon Unit in play", () => {
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [{ card: gd03ZakuFz020, exhausted: true }] },
        { play: [enemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(enemyId, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getCardsInZone("trash")).toContain(zakuId);
      expect(p2.getDamage(enemyId)).toBe(1);
    });
  });
});
