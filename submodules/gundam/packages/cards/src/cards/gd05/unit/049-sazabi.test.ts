import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05Sazabi049 } from "./049-sazabi.ts";

describe("Sazabi (GD05-049)", () => {
  /** @behavioral-proof complete: Suppression, optional sacrifice, opponent ownership, battling exclusion, and no-target continuation are public in standard two-player play. */
  it("<Suppression> destroys the first two Shields simultaneously", () => {
    const engine = GundamTestEngine.create(
      { play: [gd05Sazabi049] },
      {
        shieldArea: [
          createMockUnit({ name: "Third Shield" }),
          createMockUnit({ name: "Second Shield" }),
          createMockUnit({ name: "First Shield" }),
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "targetSelection") {
      throw new Error("Expected Sazabi's optional sacrifice");
    }
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("shieldArea")).toHaveLength(1);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
  });

  function attackSetup({ opponentHasChoice = true }: { opponentHasChoice?: boolean } = {}) {
    const sacrifice = createMockUnit({ name: "Sacrifice" });
    const battlingDefender = createMockUnit({ name: "Battling Defender", hp: 10 });
    const opponentChoice = createMockUnit({ name: "Opponent Choice" });
    const engine = GundamTestEngine.create(
      {
        play: [gd05Sazabi049, sacrifice],
        deck: 5,
      },
      {
        play: [
          { card: battlingDefender, exhausted: true },
          ...(opponentHasChoice ? [opponentChoice] : []),
        ],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sazabiId, sacrificeId] = p1.getCardsInZone("battleArea");
    const [battlingDefenderId, opponentChoiceId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(sazabiId!, battlingDefenderId!));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "targetSelection") {
      throw new Error("Expected Sazabi's optional sacrifice");
    }

    return {
      p1,
      p2,
      optional,
      sacrificeId: sacrificeId!,
      battlingDefenderId: battlingDefenderId!,
      opponentChoiceId,
    };
  }

  it("lets the opponent destroy one of their own non-battling Units", () => {
    const { p1, p2, optional, sacrificeId, battlingDefenderId, opponentChoiceId } = attackSetup();

    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    expectSuccess(p1.resolveEffect({ targets: [sacrificeId] }));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [opponentChoiceId],
    });
    expectSuccess(p2.resolveEffect({ targets: [opponentChoiceId!] }));

    expect(p1.getCardZone(sacrificeId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getCardZone(opponentChoiceId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(battlingDefenderId)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("may decline without destroying any Unit", () => {
    const { p1, p2, optional, sacrificeId, opponentChoiceId } = attackSetup();

    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));

    expect(p1.getCardZone(sacrificeId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p2.getCardZone(opponentChoiceId!)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("finishes when the opponent has no non-battling Unit", () => {
    const { p1, p2, optional, sacrificeId, battlingDefenderId } = attackSetup({
      opponentHasChoice: false,
    });

    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    expectSuccess(p1.resolveEffect({ targets: [sacrificeId] }));

    expect(p1.getCardZone(sacrificeId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getCardZone(battlingDefenderId)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p2.getBoardView().pendingChoice).toBeUndefined();
  });
});
