import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { eb01GundamTr1HazelRah007 } from "../unit/007-gundam-tr-1-hazel-rah.ts";
import { eb01ChallAcustica068 } from "./068-chall-acustica.ts";

function destroyLinkedUnit(acceptReturn: boolean) {
  const attacker = createMockUnit({ name: "Enemy Attacker", ap: 7, hp: 8 });
  const transitionDefender = createMockUnit({ name: "Transition Defender", ap: 0, hp: 10 });
  const engine = GundamTestEngine.create(
    {
      hand: [eb01ChallAcustica068],
      play: [eb01GundamTr1HazelRah007],
      resourceArea: activeResources(4),
      deck: 5,
    },
    { play: [attacker, { card: transitionDefender, exhausted: true }], deck: 5 },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const hostId = p1.getCardsInZone("battleArea")[0]!;
  const challId = p1.getHand()[0]!;
  const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");

  expectSuccess(p1.assignPilot(challId, hostId));
  expectSuccess(p1.enterBattle(hostId, transitionDefenderId!));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  passTurnThroughPublicMoves(engine, PLAYER_ONE);
  expectSuccess(p2.enterBattle(attackerId!, hostId));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());
  const optional = p1.getBoardView().pendingChoice;
  if (optional?.kind !== "optional") throw new Error("Expected Chall's destroyed choice");
  expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: acceptReturn } }));

  return { p1, hostId, challId };
}

describe("Chall Acustica (EB01-068)", () => {
  /** @behavioral-proof complete: Burst hand movement plus linked-destruction accept/decline and top-deck destination are public. */
  it("adds itself to its owner's hand when Burst is accepted", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [eb01ChallAcustica068], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    const burst = p1.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected Chall's Burst choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

    expect(p1.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("may return itself from a destroyed linked Unit to the top of its owner's deck", () => {
    const { p1, hostId, challId } = destroyLinkedUnit(true);

    expect(p1.getCardZone(hostId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(challId)).toBe(`deck:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck").at(-1)).toBe(challId);
  });

  it("leaves itself in trash when the destroyed choice is declined", () => {
    const { p1, challId } = destroyLinkedUnit(false);

    expect(p1.getCardZone(challId)).toBe(`trash:${PLAYER_ONE}`);
  });
});
