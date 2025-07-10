import { describe, expect, it } from "@jest/globals";
import {
  moanaOfMotunui,
  zeusGodOfLightning,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  goofyKnightForADay,
  merlinCrab,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  cursedMerfolkUrsulasHandiwork,
  rafikiMysticalFighter,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
/**
 * @jest-environment node
 */
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Challenger keyword", () => {
  it("Char with 0 strength should be able to receive challenger", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: merlinCrab.cost,
        hand: [merlinCrab],
        play: [cursedMerfolkUrsulasHandiwork],
      },
      {
        play: [hiddenCoveTranquilHaven],
      },
    );

    await testEngine.playCard(merlinCrab);
    await testEngine.resolveTopOfStack({
      targets: [cursedMerfolkUrsulasHandiwork],
    });
    const { defender, attacker } = await testEngine.challenge({
      attacker: cursedMerfolkUrsulasHandiwork,
      defender: hiddenCoveTranquilHaven,
    });

    expect(defender.damage).toEqual(3);
    expect(testEngine.turnEvents().challenges.at(0)).toEqual(
      expect.objectContaining({
        attacker,
        defender,
      }),
    );
  });

  it("gets bonus when challenging", () => {
    const testStore = new TestStore(
      {
        play: [zeusGodOfLightning],
      },
      {
        play: [moanaOfMotunui],
      },
    );

    const attacker = testStore.getByZoneAndId("play", zeusGodOfLightning.id);
    const defender = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );

    defender.updateCardMeta({ exerted: true });

    expect(attacker.meta.damage).toBeFalsy();
    expect(defender.meta.damage).toBeFalsy();

    testStore.store.cardStore.challenge(
      attacker.instanceId,
      defender.instanceId,
    );

    expect(attacker.meta.damage).toEqual(1);
    expect(defender.meta.damage).toEqual(4);
  });

  it("doesn't get the bonus when being challenged", () => {
    const testStore = new TestStore(
      {
        play: [zeusGodOfLightning],
      },
      {
        play: [moanaOfMotunui],
      },
    );

    const defender = testStore.getByZoneAndId("play", zeusGodOfLightning.id);
    const attacker = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );

    defender.updateCardMeta({ exerted: true });

    expect(attacker.meta.damage).toBeFalsy();
    expect(defender.meta.damage).toBeFalsy();

    testStore.store.cardStore.challenge(
      attacker.instanceId,
      defender.instanceId,
    );

    expect(attacker.meta.damage).toBeFalsy();
    expect(defender.meta.damage).toEqual(1);
  });

  it("Stacks multiple intances of the keyword", () => {
    const testStore = new TestStore(
      {
        inkwell: merlinCrab.cost,
        play: [rafikiMysticalFighter],
        hand: [merlinCrab],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const attacker = testStore.getCard(rafikiMysticalFighter);
    const defender = testStore.getCard(goofyKnightForADay);
    defender.updateCardMeta({ exerted: true });

    const buff = testStore.getCard(merlinCrab);
    buff.playFromHand();
    testStore.resolveTopOfStack({ targets: [attacker] });

    expect(attacker.meta.damage).toBeFalsy();
    expect(defender.meta.damage).toBeFalsy();

    testStore.store.cardStore.challenge(
      attacker.instanceId,
      defender.instanceId,
    );

    expect(defender.meta.damage).toEqual(
      (rafikiMysticalFighter.strength || 0) + 3 + 3,
    );
  });
});
