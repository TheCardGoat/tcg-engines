import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../testing/matchers.d.ts";
import { CyberpunkTestEngine, P1, createMockUnit, registerMatchers } from "../testing/index.ts";
import type { CardInstanceId } from "../types/branded.ts";

beforeAll(() => {
  registerMatchers();
});

function setChooseCardToPlayChoice(
  engine: CyberpunkTestEngine,
  cardId: CardInstanceId,
  free = false,
) {
  engine.judgeSetPendingChoice({
    type: "chooseCardToPlay",
    chooserId: P1,
    effectId: "",
    payload: {
      cardIds: [cardId],
      free,
      boundTargets: {},
      sourceCardId: cardId,
      sourcePlayerId: P1,
      abilityIndex: 0,
      ifEffects: [],
    },
  });
}

describe("resolveCardToPlay", () => {
  it("rejects a non-free pending card choice when the player cannot pay the effective cost", () => {
    const unit = createMockUnit({ name: "Expensive Follow-Up", cost: 3 });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 1 });
    engine.spendAllLegends();
    const cardId = engine.findCardId(unit, "hand", P1) as CardInstanceId;
    setChooseCardToPlayChoice(engine, cardId);

    const failure = engine.expectFailure(() => engine.resolveCardToPlay(unit, { as: P1 }));

    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getCard(unit, "hand", P1)).toBeInZone("hand");
    expect(engine.getState()).toHaveEddies({ player: "p1", count: 1 });
  });

  it("allows a free pending card choice without eddies", () => {
    const unit = createMockUnit({ name: "Free Follow-Up", cost: 3 });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 0 });
    engine.spendAllLegends();
    const cardId = engine.findCardId(unit, "hand", P1) as CardInstanceId;
    setChooseCardToPlayChoice(engine, cardId, true);

    expect(engine.resolveCardToPlay(unit, { as: P1 })).toBeSuccessfulCommand();
    expect(engine.getCard(unit, "field", P1)).toBeInZone("field");
    expect(engine.getState()).toHaveEddies({ player: "p1", count: 0 });
  });
});
