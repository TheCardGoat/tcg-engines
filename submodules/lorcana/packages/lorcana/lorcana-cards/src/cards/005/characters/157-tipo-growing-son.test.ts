import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tipoGrowingSon } from "./157-tipo-growing-son";

const practicedDetective = createMockCharacter({
  id: "tipo-practiced-detective",
  name: "Practiced Detective",
  cost: 1,
});

describe("Tipo - Growing Son", () => {
  it("may put a card from your hand into your inkwell facedown and exerted when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tipoGrowingSon, practicedDetective],
      inkwell: tipoGrowingSon.cost,
      deck: 1,
    });
    const detectiveId = testEngine.findCardInstanceId(practicedDetective, "hand", "p1");

    expect(testEngine.asPlayerOne().playCard(tipoGrowingSon)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tipoGrowingSon, {
        resolveOptional: true,
        targets: [detectiveId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 0,
        inkwell: tipoGrowingSon.cost + 1,
      }),
    );
    expect(testEngine.asPlayerOne().getCardZone(detectiveId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(detectiveId)).toEqual(
      expect.objectContaining({ exerted: true, zone: "inkwell" }),
    );
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[detectiveId]?.publicFaceState,
    ).toBe("faceDown");
  });

  it("supports accepting optional first, then selecting target via pending effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tipoGrowingSon, practicedDetective],
      inkwell: tipoGrowingSon.cost,
      deck: 1,
    });
    const detectiveId = testEngine.findCardInstanceId(practicedDetective, "hand", "p1");

    expect(testEngine.asPlayerOne().playCard(tipoGrowingSon)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;

    // Accept the optional effect — the bag executes immediately and a pending effect
    // is created for the target selection (which card to put into inkwell).
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tipoGrowingSon, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // Bag should be resolved; a pending effect is waiting for the target selection.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    // Provide the target card from hand via the pending effect.
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [detectiveId] }),
    ).toBeSuccessfulCommand();

    // The effect should now be fully resolved.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(detectiveId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(detectiveId)).toEqual(
      expect.objectContaining({ exerted: true, zone: "inkwell" }),
    );
  });

  it("supports declining the optional effect in multi-step flow", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tipoGrowingSon, practicedDetective],
      inkwell: tipoGrowingSon.cost,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(tipoGrowingSon)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;

    // Decline the optional effect
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tipoGrowingSon, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // Bag should be empty - effect was declined
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // Card should still be in hand
    const detectiveId = testEngine.findCardInstanceId(practicedDetective, "hand", "p1");
    expect(testEngine.asPlayerOne().getCardZone(detectiveId)).toBe("hand");
  });
});
