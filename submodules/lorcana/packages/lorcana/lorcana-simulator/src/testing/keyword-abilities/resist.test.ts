import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  fireTheCannons,
  mickeyMouseTrueFriend,
  plasmaBlaster,
} from "@tcg/lorcana-cards/cards/001";
import { beastRelentless, mouseArmor } from "@tcg/lorcana-cards/cards/002";
import { bestowAGift } from "@tcg/lorcana-cards/cards/003";
import { mosquitoBite } from "@tcg/lorcana-cards/cards/006";
import { eeyoreOverstuffedDonkey } from "@tcg/lorcana-cards/cards/009";

describe("Resist - Eeyore, Overstuffed Donkey - Resist +1 (Damage dealt to this character is reduced by 1.)", () => {
  it("Resist reduces damage from effects", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [eeyoreOverstuffedDonkey],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [eeyoreOverstuffedDonkey] }),
    ).toBeSuccessfulCommand();

    // Fire the Cannons deals 2 damage, Resist +1 reduces to 1
    expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(1);
  });

  it("Resist reduces damage from challenges", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mickeyMouseTrueFriend],
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [{ card: eeyoreOverstuffedDonkey, exerted: true }],
      },
    );

    // First deal 1 damage via Fire the Cannons (2 - 1 resist = 1)
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [eeyoreOverstuffedDonkey] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(1);

    // Then challenge: Mickey has 3 strength, Resist +1 means 2 damage
    expect(
      testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, eeyoreOverstuffedDonkey),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(3);
  });

  it("Resist stacks with other Resist effects", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [mouseArmor],
      },
      {
        play: [eeyoreOverstuffedDonkey],
      },
    );

    // Grant additional Resist +1 from Mouse Armor
    expect(
      testEngine.asPlayerOne().activateAbility(mouseArmor, { targets: [eeyoreOverstuffedDonkey] }),
    ).toBeSuccessfulCommand();

    // Fire the Cannons deals 2 damage, Resist +2 (stacked) reduces to 0
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [eeyoreOverstuffedDonkey] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(0);
  });

  it("Damage reduced to 0 means no damage is dealt (triggers don't fire)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        play: [plasmaBlaster, { card: beastRelentless, exerted: true }],
      },
      {
        play: [eeyoreOverstuffedDonkey],
      },
    );

    // Plasma Blaster deals 1 damage, Resist +1 reduces to 0
    expect(
      testEngine
        .asPlayerOne()
        .activateAbility(plasmaBlaster, { targets: [eeyoreOverstuffedDonkey] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(0);
    // Beast's "RELENTLESS" should NOT trigger since no damage was dealt
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
  });

  it("Put damage ignores Resist", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mosquitoBite],
        inkwell: mosquitoBite.cost,
      },
      {
        play: [eeyoreOverstuffedDonkey],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(mosquitoBite, { targets: [eeyoreOverstuffedDonkey] }),
    ).toBeSuccessfulCommand();

    // Put damage is not reduced by Resist
    expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(1);
  });

  it("Move damage ignores Resist", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bestowAGift],
        inkwell: bestowAGift.cost,
        play: [arielOnHumanLegs],
      },
      {
        play: [eeyoreOverstuffedDonkey],
      },
    );

    testEngine.asServer().manualSetDamage(arielOnHumanLegs, 2);
    expect(
      testEngine.asPlayerOne().playCard(bestowAGift, {
        targets: [arielOnHumanLegs, eeyoreOverstuffedDonkey],
      }),
    ).toBeSuccessfulCommand();

    // Moved damage is not reduced by Resist
    expect(testEngine.asServer().getDamage(arielOnHumanLegs)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(1);
  });
});
