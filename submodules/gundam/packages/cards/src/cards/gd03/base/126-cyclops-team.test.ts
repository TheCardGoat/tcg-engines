import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03CyclopsTeam126 } from "./126-cyclops-team.ts";

describe("Cyclops Team (GD03-126)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03CyclopsTeam126] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03CyclopsTeam126)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create({
      hand: [gd03CyclopsTeam126],
      resourceArea: activeResources(4),
      shieldArea: [returnedShield],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03CyclopsTeam126));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03CyclopsTeam126)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("gives friendly Unit tokens AP+1 during the opponent's turn only", () => {
    const token = createMockUnit({ ap: 2, hp: 1 });
    const nonToken = createMockUnit({ ap: 2, hp: 1 });
    const engine = GundamTestEngine.create(
      {
        play: [{ card: token, isToken: true }, nonToken],
        baseSection: [gd03CyclopsTeam126],
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [tokenId, nonTokenId] = p1.getCardsInZone("battleArea");

    expect(p1.getVisibleCard(tokenId!)?.effectiveAp).toBe(2);
    expect(p1.getVisibleCard(nonTokenId!)?.effectiveAp).toBe(2);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(tokenId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(nonTokenId!)?.effectiveAp).toBe(2);
  });
});
