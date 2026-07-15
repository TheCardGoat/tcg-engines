import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { baymaxPersonalHealthcareCompanion } from "../characters";
import { naveensUkulele } from "../items";
import { prepareYourBot } from "./165-prepare-your-bot";

describe("Prepare Your Bot", () => {
  it("readies a chosen item when option 0 is selected", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [prepareYourBot],
      inkwell: prepareYourBot.cost,
      play: [naveensUkulele],
    });

    testEngine.asServer().manualExertCard(naveensUkulele);
    expect(testEngine.asPlayerOne().isExerted(naveensUkulele)).toBe(true);

    expect(
      testEngine.asPlayerOne().playCard(prepareYourBot, {
        choiceIndex: 0,
        targets: [naveensUkulele],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(naveensUkulele)).toBe(false);
  });

  it("readies a chosen Robot character when option 1 is selected", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [prepareYourBot],
      inkwell: prepareYourBot.cost,
      play: [baymaxPersonalHealthcareCompanion],
    });

    testEngine.asServer().manualExertCard(baymaxPersonalHealthcareCompanion);
    expect(testEngine.asPlayerOne().isExerted(baymaxPersonalHealthcareCompanion)).toBe(true);

    expect(
      testEngine.asPlayerOne().playCard(prepareYourBot, {
        choiceIndex: 1,
        targets: [baymaxPersonalHealthcareCompanion],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeReady(baymaxPersonalHealthcareCompanion);
  });

  it("prevents the readied Robot character from questing for the rest of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [prepareYourBot],
      inkwell: prepareYourBot.cost,
      play: [baymaxPersonalHealthcareCompanion],
    });

    testEngine.asServer().manualExertCard(baymaxPersonalHealthcareCompanion);

    expect(
      testEngine.asPlayerOne().playCard(prepareYourBot, {
        choiceIndex: 1,
        targets: [baymaxPersonalHealthcareCompanion],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: baymaxPersonalHealthcareCompanion,
      restriction: "cant-quest",
    });
  });

  it("cant-quest restriction on the Robot expires after the turn ends", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [prepareYourBot],
        inkwell: prepareYourBot.cost,
        play: [baymaxPersonalHealthcareCompanion],
      },
      {},
    );

    testEngine.asServer().manualExertCard(baymaxPersonalHealthcareCompanion);

    expect(
      testEngine.asPlayerOne().playCard(prepareYourBot, {
        choiceIndex: 1,
        targets: [baymaxPersonalHealthcareCompanion],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: baymaxPersonalHealthcareCompanion,
      restriction: "cant-quest",
    });

    testEngine.asServer().passTurn();
    testEngine.asServer().passTurn();

    expect(testEngine.asPlayerOne()).not.toHaveRestriction({
      card: baymaxPersonalHealthcareCompanion,
      restriction: "cant-quest",
    });
  });
});
