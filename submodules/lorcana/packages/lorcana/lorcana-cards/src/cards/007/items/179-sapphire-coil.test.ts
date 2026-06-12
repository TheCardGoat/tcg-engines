import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli, arielOnHumanLegs, heiheiBoatSnack, simbaProtectiveCub } from "../../001";
import { howFarIllGo } from "../../003/actions/161-how-far-ill-go";
import { tipoGrowingSon } from "../../005/characters/157-tipo-growing-son";
import { merlinCleverClairvoyant } from "../../007/characters/067-merlin-clever-clairvoyant";
import { visitingChristmasPast } from "../../011/actions/162-visiting-christmas-past";
import { sapphireCoil } from "./179-sapphire-coil";

const inkCard = createMockCharacter({
  id: "sapphire-coil-ink-card",
  name: "Sapphire Coil Ink Card",
  cost: 1,
});

const weakenedTarget = createMockCharacter({
  id: "sapphire-coil-weakened-target",
  name: "Sapphire Coil Weakened Target",
  cost: 2,
  strength: 4,
});

describe("Sapphire Coil", () => {
  it("gives the chosen character -2 strength this turn when you ink a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkCard],
      play: [sapphireCoil, weakenedTarget],
    });

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sapphireCoil, {
        resolveOptional: true,
        targets: [weakenedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(weakenedTarget)).toBe(2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(weakenedTarget)).toBe(4);
  });

  it("regression: strength reduction does not persist into opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [inkCard],
        play: [sapphireCoil, weakenedTarget],
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sapphireCoil, {
        resolveOptional: true,
        targets: [weakenedTarget],
      }),
    ).toBeSuccessfulCommand();

    // During player one's turn, strength is reduced
    expect(testEngine.asPlayerOne().getCardStrength(weakenedTarget)).toBe(2);

    // Pass to opponent's turn - strength should return to normal
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(weakenedTarget)).toBe(4);
  });

  it("triggers when a card is put into inkwell via scry", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [howFarIllGo],
      play: [sapphireCoil, weakenedTarget],
      inkwell: howFarIllGo.cost,
      deck: [aladdinPrinceAli, arielOnHumanLegs],
    });

    expect(
      testEngine.asPlayerOne().playCard(howFarIllGo, {
        destinations: [
          { zone: "hand", cards: [arielOnHumanLegs] },
          { zone: "inkwell", cards: [aladdinPrinceAli] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sapphireCoil, {
        resolveOptional: true,
        targets: [weakenedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(weakenedTarget)).toBe(2);
  });

  it("triggers when a card is put into inkwell via put-into-inkwell effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tipoGrowingSon, inkCard],
      play: [sapphireCoil, weakenedTarget],
      inkwell: tipoGrowingSon.cost,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(tipoGrowingSon)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const tipoBagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolveBag(tipoBagId, {
        resolveOptional: true,
        targets: [testEngine.findCardInstanceId(inkCard, "hand", "p1")],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sapphireCoil, {
        resolveOptional: true,
        targets: [weakenedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(weakenedTarget)).toBe(2);
  });

  it("triggers when a card is put into inkwell via reveal-and-route effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [merlinCleverClairvoyant, sapphireCoil, weakenedTarget],
      deck: [heiheiBoatSnack],
    });

    expect(testEngine.asPlayerOne().quest(merlinCleverClairvoyant)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ namedCard: "HeiHei" }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sapphireCoil, {
        resolveOptional: true,
        targets: [weakenedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(weakenedTarget)).toBe(2);
  });

  it("triggers when a card is put into inkwell via move-cards-from-under effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [visitingChristmasPast],
      play: [simbaProtectiveCub, sapphireCoil, weakenedTarget],
      inkwell: visitingChristmasPast.cost,
      deck: [heiheiBoatSnack],
    });

    testEngine.putCardUnder(simbaProtectiveCub, heiheiBoatSnack);
    const [heiheiId] = testEngine.getCardsUnder(simbaProtectiveCub);

    expect(
      testEngine.asPlayerOne().playCard(visitingChristmasPast, {
        targets: [heiheiId],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sapphireCoil, {
        resolveOptional: true,
        targets: [weakenedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(weakenedTarget)).toBe(2);
  });
});
