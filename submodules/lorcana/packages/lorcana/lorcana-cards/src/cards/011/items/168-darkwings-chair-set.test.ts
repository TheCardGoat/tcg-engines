import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import type { CharacterCard } from "@tcg/lorcana-types";
import {
  darkwingDuckLaunchpadStCanardsFinest,
  darkwingDuckShadowySuperhero,
  launchpadSkyPatrol,
} from "../../013/characters";
import {
  darkwingDuckCoolUnderPressure,
  darkwingDuckCrimeFighter,
  darkwingDuckDashingGadgeteer,
  darkwingDuckDrakeMallard,
  launchpadHideoutDefender,
  launchpadTrustySidekick,
} from "../characters";
import { darkwingsChairSet } from "./168-darkwings-chair-set";

const secretInk = createMockCharacter({
  id: "darkwings-chair-set-secret-ink",
  name: "Secret Ink",
  cost: 1,
});

const injuredAlly = createMockCharacter({
  id: "darkwings-chair-set-injured-ally",
  name: "Injured Ally",
  cost: 2,
  willpower: 6,
});

describe("Darkwing's Chair Set", () => {
  it("may put the top card of your deck into your inkwell facedown and exerted when you play it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [darkwingsChairSet],
      deck: [secretInk],
      inkwell: darkwingsChairSet.cost,
    });

    expect(testEngine.asPlayerOne().playCard(darkwingsChairSet)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingsChairSet),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(secretInk)).toBe("inkwell");
    expect(testEngine.asPlayerOne().isExerted(secretInk)).toBe(true);
  });

  it("can decline Secret Entrance and leave the top card in the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [darkwingsChairSet],
      deck: [secretInk],
      inkwell: darkwingsChairSet.cost,
    });

    expect(testEngine.asPlayerOne().playCard(darkwingsChairSet)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingsChairSet, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(secretInk)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(darkwingsChairSet)).toBe("play");
  });

  it("removes up to 2 damage from a non-Darkwing Duck character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [darkwingsChairSet, injuredAlly],
      deck: 2,
    });

    testEngine.asServer().manualSetDamage(injuredAlly, 4);

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsChairSet, {
        ability: "SUDDEN SPIN",
        targets: [injuredAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(darkwingsChairSet)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: injuredAlly, value: 2 });
  });

  it("removes only up to 2 damage from Launchpad (not named Darkwing Duck)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [darkwingsChairSet, { card: launchpadHideoutDefender, damage: 4 }],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsChairSet, {
        ability: "SUDDEN SPIN",
        targets: [launchpadHideoutDefender],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(darkwingsChairSet)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: launchpadHideoutDefender,
      value: 2,
    });
  });

  it("removes only up to 2 damage from Launchpad - Sky Patrol", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [darkwingsChairSet, { card: launchpadSkyPatrol, damage: 4 }],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsChairSet, {
        ability: "SUDDEN SPIN",
        targets: [launchpadSkyPatrol],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: launchpadSkyPatrol, value: 2 });
  });

  it("removes only up to 2 damage from Launchpad - Trusty Sidekick", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [darkwingsChairSet, { card: launchpadTrustySidekick, damage: 3 }],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsChairSet, {
        ability: "SUDDEN SPIN",
        targets: [launchpadTrustySidekick],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: launchpadTrustySidekick, value: 1 });
  });

  const darkwingDuckTargets: Array<{ card: CharacterCard; label: string }> = [
    { card: darkwingDuckDrakeMallard, label: "Darkwing Duck - Drake Mallard" },
    { card: darkwingDuckDashingGadgeteer, label: "Darkwing Duck - Dashing Gadgeteer" },
    { card: darkwingDuckCrimeFighter, label: "Darkwing Duck - Crime Fighter" },
    { card: darkwingDuckCoolUnderPressure, label: "Darkwing Duck - Cool Under Pressure" },
    { card: darkwingDuckShadowySuperhero, label: "Darkwing Duck - Shadowy Superhero" },
  ];

  it.each(darkwingDuckTargets)(
    "removes up to 4 damage from $label",
    ({ card }: (typeof darkwingDuckTargets)[number]) => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [darkwingsChairSet, { card, damage: 4 }],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(darkwingsChairSet, {
          ability: "SUDDEN SPIN",
          targets: [card],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(darkwingsChairSet)).toBe("discard");
      expect(testEngine.asPlayerOne()).toHaveDamage({ card, value: 0 });
    },
  );

  // CR 5.2.6.1: ampersand-named characters count as either name part.
  it("removes up to 4 damage when the chosen character is Darkwing Duck & Launchpad", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [darkwingsChairSet, { card: darkwingDuckLaunchpadStCanardsFinest, damage: 4 }],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsChairSet, {
        ability: "SUDDEN SPIN",
        targets: [darkwingDuckLaunchpadStCanardsFinest],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(darkwingsChairSet)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: darkwingDuckLaunchpadStCanardsFinest,
      value: 0,
    });
  });

  it("leaves residual damage on Darkwing Duck & Launchpad when starting above 4", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [darkwingsChairSet, { card: darkwingDuckLaunchpadStCanardsFinest, damage: 6 }],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsChairSet, {
        ability: "SUDDEN SPIN",
        targets: [darkwingDuckLaunchpadStCanardsFinest],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: darkwingDuckLaunchpadStCanardsFinest,
      value: 2,
    });
  });
});
