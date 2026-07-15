import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01UnicornGundamUnicornMode005 } from "./005-unicorn-gundam-unicorn-mode.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Unicorn Gundam (Unicorn Mode) (GD01-005)", () => {
  it("returns its linked Pilot to hand, then asks which card to discard when destroyed", () => {
    const banagher = createMockPilot({ name: "Banagher Links", level: 1, cost: 1 });
    const keep = createMockUnit({ name: "Keep" });
    const discard = createMockUnit({ name: "Discard" });
    const attacker = createMockUnit({ ap: 5, hp: 10 });
    const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [banagher, keep, discard],
        play: [gd01UnicornGundamUnicornMode005],
        resourceArea: activeResources(5),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [attacker, transitionDefender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");
    const [banagherId, keepId, discardId] = p1.getHand();

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [transitionDefenderId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(banagher, unitId));
    expectSuccess(p1.enterBattle(unitId, transitionDefenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(attackerId!, unitId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([banagherId, keepId, discardId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [discardId!] }));

    expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(banagherId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(keepId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(discardId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("sends a non-link Pilot to trash and does not discard when the Unit is destroyed", () => {
    const wrongPilot = createMockPilot({ name: "Wrong Pilot", level: 1, cost: 1 });
    const filler = createMockUnit({ name: "Filler" });
    const attacker = createMockUnit({ ap: 5, hp: 10 });
    const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [wrongPilot, filler],
        play: [gd01UnicornGundamUnicornMode005],
        resourceArea: activeResources(5),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [attacker, transitionDefender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");
    const [pilotId, fillerId] = p1.getHand();

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [transitionDefenderId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(wrongPilot, unitId));
    expectSuccess(p1.enterBattle(unitId, transitionDefenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(attackerId!, unitId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(pilotId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(fillerId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
