import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GuelJeturk097 } from "./097-guel-jeturk.ts";

describe("Guel Jeturk (GD01-097)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01GuelJeturk097] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01GuelJeturk097)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("cannot activate while the opponent has fewer than 8 cards in hand", () => {
    const host = createMockUnit({
      ap: 3,
      hp: 4,
      keywordEffects: [{ keyword: "Support", value: 1 }],
    });
    const supportTarget = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd01GuelJeturk097],
      play: [host, supportTarget],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, supportTargetId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(hostId!, supportTargetId!));
    expectSuccess(p1.assignPilot(gd01GuelJeturk097, hostId!));
    const pilotId = p1.getPilotId(hostId!)!;
    expectFailure(p1.activateAbility(pilotId, 0), "CONDITIONS_NOT_MET");

    expect(p1.isExhausted(hostId!)).toBe(true);
  });

  it("sets the paired Unit active but prevents it from attacking for the turn", () => {
    const host = createMockUnit({
      ap: 3,
      hp: 4,
      keywordEffects: [{ keyword: "Support", value: 1 }],
    });
    const supportTarget = createMockUnit();
    const opponentHand = Array.from({ length: 8 }, (_, index) =>
      createMockUnit({ name: `Opponent Card ${index + 1}` }),
    );
    const restCommand = createMockCommand({
      name: "Rest a Friendly Unit",
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "rest",
                target: { owner: "friendly", cardType: "unit", state: "active", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Rest 1 active friendly Unit.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GuelJeturk097, restCommand],
        play: [host, supportTarget],
        resourceArea: activeResources(3),
      },
      { hand: opponentHand, shieldArea: [createMockUnit({ name: "Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, supportTargetId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(hostId!, supportTargetId!));
    expectSuccess(p1.assignPilot(gd01GuelJeturk097, hostId!));
    const pilotId = p1.getPilotId(hostId!)!;
    expectSuccess(p1.activateAbility(pilotId, 0));

    expect(p1.isExhausted(hostId!)).toBe(false);
    expectFailure(p1.enterBattle(hostId!, "direct"), "CANNOT_ATTACK");

    expectSuccess(p1.playCommand(restCommand));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected the setup Command to ask which active friendly Unit rests");
    }
    expect(restChoice.legalTargetIds).toContain(hostId);
    expectSuccess(p1.resolveEffect({ targets: [hostId!] }));
    expect(p1.isExhausted(hostId!)).toBe(true);

    expectFailure(p1.activateAbility(pilotId, 0), "ABILITY_LIMIT_REACHED");
    expect(p1.isExhausted(hostId!)).toBe(true);
  });
});
