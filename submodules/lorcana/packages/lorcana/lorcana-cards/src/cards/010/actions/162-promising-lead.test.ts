import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { buzzLightyearSpaceRanger } from "../../012/characters";
import { basilTenaciousMouse } from "../characters";
import { promisingLead } from "./162-promising-lead";

const supportTarget = createMockCharacter({
  id: "promising-lead-support-target",
  name: "Promising Lead Support Target",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
});

describe("Promising Lead", () => {
  it("gives the chosen Detective +1 lore and Support this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [promisingLead],
      inkwell: promisingLead.cost,
      play: [basilTenaciousMouse],
    });

    const playResult = testEngine.asPlayerOne().playCard(promisingLead, {
      targets: [basilTenaciousMouse],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveLore({ card: basilTenaciousMouse, value: 3 });
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: basilTenaciousMouse,
      keyword: "Support",
    });
  });

  it("grants +1 lore and Support to a non-Detective", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [promisingLead],
      inkwell: promisingLead.cost,
      play: [simbaProtectiveCub],
    });

    const playResult = testEngine.asPlayerOne().playCard(promisingLead, {
      targets: [simbaProtectiveCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveLore({ card: simbaProtectiveCub, value: 2 });
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: simbaProtectiveCub,
      keyword: "Support",
    });
  });

  it("creates a Support trigger when the chosen character quests this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [promisingLead],
      inkwell: promisingLead.cost,
      play: [{ card: buzzLightyearSpaceRanger, isDrying: false }, supportTarget],
      deck: [],
    });

    expect(
      testEngine.asPlayerOne().playCard(promisingLead, {
        targets: [buzzLightyearSpaceRanger],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: buzzLightyearSpaceRanger,
      keyword: "Support",
    });

    expect(testEngine.asPlayerOne().quest(buzzLightyearSpaceRanger)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(buzzLightyearSpaceRanger, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + buzzLightyearSpaceRanger.strength,
    );
  });
});
