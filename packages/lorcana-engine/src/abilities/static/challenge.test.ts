/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { enchantressUnexpectedJudge } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  cursedMerfolkUrsulasHandiwork,
  kidaProtectorOfAtlantis,
  robinHoodBelovedOutlaw,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import {
  criKeeLuckyCricket,
  yaoImperialSoldier,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
import { rooLittlestPirate } from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

it("Char with 0 strength should be able to challenge", async () => {
  const testEngine = new TestEngine(
    {
      deck: 5,
      play: [cursedMerfolkUrsulasHandiwork],
    },
    {
      play: [hiddenCoveTranquilHaven],
    },
  );

  const { attacker, defender } = await testEngine.challenge({
    attacker: cursedMerfolkUrsulasHandiwork,
    defender: hiddenCoveTranquilHaven,
  });

  expect(testEngine.turnEvents().challenges.at(0)).toEqual(
    expect.objectContaining({
      attacker,
      defender,
    }),
  );
});

it("calculates challenger plus modifiers correctly", async () => {
  const testEngine = new TestEngine(
    {
      deck: 5,
      play: [yaoImperialSoldier],
      hand: [kidaProtectorOfAtlantis],
      inkwell: kidaProtectorOfAtlantis.cost,
    },
    {
      play: [liloMakingAWish],
    },
  );

  testEngine.getCardModel(liloMakingAWish).updateCardMeta({ exerted: true });

  testEngine.playCard(kidaProtectorOfAtlantis);

  // 2/4 Challenger +2, Kida effect -3 strength, strength hard floor at 0, challenge time strength 1 (2 - 3 + 2)
  expect(testEngine.getCardModel(yaoImperialSoldier).strength).toEqual(0);
  expect(
    testEngine.getCardModel(yaoImperialSoldier).challengeTimeAttackerStrength,
  ).toEqual(1);

  testEngine.challenge({
    attacker: yaoImperialSoldier,
    defender: liloMakingAWish,
  });

  expect(testEngine.getCardModel(yaoImperialSoldier).meta.damage).toEqual(0);
  expect(testEngine.getCardModel(liloMakingAWish).zone).toEqual("discard");
});

it("calculates reverse-challenger plus modifiers correctly", async () => {
  const testEngine = new TestEngine(
    {
      deck: 5,
      play: [yaoImperialSoldier],
      hand: [rooLittlestPirate],
      inkwell: kidaProtectorOfAtlantis.cost,
    },
    {
      play: [enchantressUnexpectedJudge],
    },
  );

  const target = testEngine.getCardModel(enchantressUnexpectedJudge);
  target.updateCardMeta({ exerted: true });

  await testEngine.playCard(rooLittlestPirate);
  await testEngine.resolveOptionalAbility();
  await testEngine.resolveTopOfStack({ targets: [target] });

  await testEngine.challenge({
    attacker: yaoImperialSoldier,
    defender: enchantressUnexpectedJudge,
  });

  // Enchantress 1/1 +2 reverse-challenger, Roo effect -2 strength, strength hard floor at 0, challenge time strength 1 (1 - 2 + 2)
  expect(testEngine.getCardModel(yaoImperialSoldier).meta.damage).toEqual(1);
  expect(testEngine.getCardModel(enchantressUnexpectedJudge).zone).toEqual(
    "discard",
  );
});

it("calculates plus and minus modifiers correctly", async () => {
  const testEngine = new TestEngine(
    {
      inkwell: kidaProtectorOfAtlantis.cost,
      play: [liloMakingAWish],
      hand: [kidaProtectorOfAtlantis],
    },
    {
      deck: 5,
      play: [robinHoodBelovedOutlaw],
      hand: [criKeeLuckyCricket],
      inkwell: criKeeLuckyCricket.cost,
    },
  );

  testEngine.questCard(liloMakingAWish);
  testEngine.playCard(kidaProtectorOfAtlantis);
  testEngine.passTurn();

  // 2/2 -3 strength from Kida effect
  expect(
    testEngine.getCardModel(robinHoodBelovedOutlaw)
      .challengeTimeAttackerStrength,
  ).toEqual(0);

  testEngine.playCard(criKeeLuckyCricket);

  // +3 strength from Cri-Kee effect, effects are cumulative at challenge time
  expect(
    testEngine.getCardModel(robinHoodBelovedOutlaw)
      .challengeTimeAttackerStrength,
  ).toEqual(2);

  testEngine.challenge({
    attacker: robinHoodBelovedOutlaw,
    defender: liloMakingAWish,
  });

  expect(testEngine.getCardModel(robinHoodBelovedOutlaw).meta.damage).toEqual(
    0,
  );
  expect(testEngine.getCardModel(liloMakingAWish).zone).toEqual("discard");
});

// TODO: players have reported that moving to discard is problematic, as the engine is not yet ready.
// We should enable this test once we have all cards implemented.
it.skip("Basic Challenge, both die", () => {
  // const engine = createRuleEngine(
  //   createMockGame(
  //     {
  //       play: [mickeyMouseTrueFriend],
  //     },
  //     {
  //       play: [mickeyMouseTrueFriend],
  //     },
  //   ),
  // );
  //
  // // Both are 3/3
  // const attacker = engine.get.zoneCards("play", "player_one")[0];
  // const defender = engine.get.zoneCards("play", "player_two")[0];
  //
  // expect(engine.get.zoneCards("play", "player_one")).toHaveLength(1);
  // expect(engine.get.zoneCards("play", "player_two")).toHaveLength(1);
  // expect(engine.get.zoneCards("discard", "player_one")).toHaveLength(0);
  // expect(engine.get.zoneCards("discard", "player_two")).toHaveLength(0);
  //
  // engine.moves?.challenge(attacker, defender);
  //
  // expect(engine.get.zoneCards("play", "player_one")).toHaveLength(0);
  // expect(engine.get.zoneCards("play", "player_two")).toHaveLength(0);
  // expect(engine.get.zoneCards("discard", "player_one")).toHaveLength(1);
  // expect(engine.get.zoneCards("discard", "player_two")).toHaveLength(1);
});

it("Basic Challenge, none die", () => {
  // const engine = createRuleEngine(
  //   createMockGame(
  //     {
  //       play: [moanaOfMotunui],
  //     },
  //     {
  //       play: [mickeyMouseTrueFriend],
  //     },
  //   ),
  // );
  //
  // // Attack is 1/6
  // const attacker = engine.get.zoneCards("play", "player_one")[0];
  // // Defender is 3/3
  // const defender = engine.get.zoneCards("play", "player_two")[0];
  //
  // expect(engine.get.zoneCards("play", "player_one")).toHaveLength(1);
  // expect(engine.get.zoneCards("play", "player_two")).toHaveLength(1);
  //
  // engine.moves.tapCard(defender, { exerted: true });
  // engine.moves.challenge(attacker, defender);
  //
  // expect(engine.get.zoneCards("play", "player_one")).toHaveLength(1);
  // expect(engine.get.zoneCards("play", "player_two")).toHaveLength(1);
  // expect(engine.get.tableCard(attacker)?.meta).toMatchObject({
  //   damage: mickeyMouseTrueFriend.strength,
  // });
  // expect(engine.get.tableCard(defender)?.meta).toMatchObject({
  //   damage: moanaOfMotunui.strength,
  // });
});

it("Exerts challenger", () => {
  // const engine = createRuleEngine(
  //   createMockGame(
  //     {
  //       play: [moanaOfMotunui],
  //     },
  //     {
  //       play: [moanaOfMotunui],
  //     },
  //   ),
  // );
  //
  // const attacker = engine.get.zoneCards("play", "player_one")[0];
  // const defender = engine.get.zoneCards("play", "player_two")[0];
  // engine.moves.tapCard(defender, { exerted: true });
  //
  // expect(engine.get.tableCard(attacker)?.meta?.exerted).toBeFalsy();
  // engine.moves?.challenge(attacker, defender);
  // expect(engine.get.tableCard(attacker)?.meta?.exerted).toBeTruthy();
});

it("Can't challenge with fresh ink", () => {
  // const testStore = new TestStore(
  //   {
  //     inkwell: moanaOfMotunui.cost,
  //     hand: [moanaOfMotunui],
  //   },
  //   {
  //     play: [sebastianCourtComposer],
  //   },
  // );
  //
  // const attacker = testStore.getByZoneAndId("hand", moanaOfMotunui.id);
  // testStore.store.playCardFromHand(attacker.instanceId);
  //
  // const defender = testStore.getByZoneAndId(
  //   "play",
  //   sebastianCourtComposer.id,
  //   "player_two",
  // );
  // defender.updateCardMeta({ exerted: true });
  //
  // testStore.store.cardStore.challenge(attacker.instanceId, defender.instanceId);
  //
  // expect(attacker.meta.damage).toBeFalsy();
  // expect(defender.meta.damage).toBeFalsy();
});

it.skip("doesn't challenge ready characters", () => {
  expect(false).toEqual(true);
});

// TODO: effects when challenge and banish
