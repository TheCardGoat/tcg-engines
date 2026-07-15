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
import { st07ArmedIntervention013 } from "./013-armed-intervention.ts";

describe("Armed Intervention (ST07-013)", () => {
  it("【Burst】Draw 1.", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const drawCard = createMockUnit({ name: "Drawn Card" });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st07ArmedIntervention013], deck: [drawCard] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getHand()).toHaveLength(1);
    expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("【Action】changes the battling enemy Unit's attack target to a rested friendly CB Unit", () => {
    const attacker = createMockUnit({ level: 4, ap: 3 });
    const cbTarget = createMockUnit({ traits: ["cb"], hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07ArmedIntervention013],
        resourceArea: activeResources(4),
        play: [{ card: cbTarget, exhausted: true }],
        deck: 5,
      },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(st07ArmedIntervention013, { targets: [targetId] }));

    expect(p1.getBoardView().pendingCombat?.target).toBe(targetId);
  });

  it("cannot choose an active friendly CB Unit as the new attack target", () => {
    const attacker = createMockUnit({ level: 4, ap: 3 });
    const cbTarget = createMockUnit({ traits: ["cb"], hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07ArmedIntervention013],
        resourceArea: activeResources(4),
        play: [cbTarget],
        deck: 5,
      },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());

    expectFailure(
      p1.playCommand(st07ArmedIntervention013, { targets: [targetId] }),
      "INVALID_TARGET",
    );
  });
});
