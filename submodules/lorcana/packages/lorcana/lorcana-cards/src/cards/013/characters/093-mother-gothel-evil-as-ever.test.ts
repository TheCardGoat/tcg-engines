import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { angelExperiment624 } from "../../011/characters/191-angel-experiment-624";
import { rapunzelFlynnRiderUnlikelyPair } from "./100-rapunzel-flynn-rider-unlikely-pair";
import { motherGothelEvilAsEver } from "./093-mother-gothel-evil-as-ever";

const discardChosenCard = createMockAction({
  id: "mother-gothel-evil-as-ever-discard-action",
  name: "Discard Chosen Card",
  cost: 1,
  text: "Choose and discard a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "discard",
        amount: 1,
        target: "CONTROLLER",
        chosen: true,
      },
    },
  ],
});

const angelTarget = createMockCharacter({
  id: "mother-gothel-evil-as-ever-angel-target",
  name: "Angel Target",
  cost: 1,
  strength: 1,
  willpower: 2,
});

describe("Mother Gothel - Evil as Ever", () => {
  it("may play herself from discard when discarded during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [discardChosenCard, motherGothelEvilAsEver],
      inkwell: discardChosenCard.cost + motherGothelEvilAsEver.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(discardChosenCard, {
        targets: [motherGothelEvilAsEver],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(motherGothelEvilAsEver)).toBe("discard");

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(motherGothelEvilAsEver, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(motherGothelEvilAsEver)).toBe("play");
  });

  it("logs the competing play-from-discard trigger as rejected after MUMMY'S BACK plays her", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [angelExperiment624, rapunzelFlynnRiderUnlikelyPair],
        hand: [motherGothelEvilAsEver],
        inkwell: 99,
        deck: [],
      },
      {
        play: [angelTarget],
        deck: [],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(angelExperiment624, {
        costs: { discardCards: [motherGothelEvilAsEver] },
        targets: [angelTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(motherGothelEvilAsEver)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(motherGothelEvilAsEver, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(motherGothelEvilAsEver)).toBe("play");

    expect(testEngine.asPlayerOne().getCardZone(motherGothelEvilAsEver)).toBe("play");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    const motherGothelId = testEngine.findCardInstanceId(
      motherGothelEvilAsEver,
      "play",
      PLAYER_ONE,
    );
    const rapunzelFlynnId = testEngine.findCardInstanceId(
      rapunzelFlynnRiderUnlikelyPair,
      "play",
      PLAYER_ONE,
    );
    const logs = testEngine.getServerEngine().getRuntime().getMoveLogHistory();

    expect(logs).toContainEqual(
      expect.objectContaining({
        moveType: "resolveBag",
        public: expect.arrayContaining([
          {
            key: "lorcana.bag.resolve.completed.targets.named",
            values: {
              playerId: PLAYER_ONE,
              sourceId: motherGothelId,
              abilityName: "MUMMY'S BACK",
              targets: [motherGothelId],
              effectType: "play-card",
              sourceZone: "discard",
            },
          },
        ]),
      }),
    );
    expect(logs).toContainEqual(
      expect.objectContaining({
        moveType: "resolveEffect",
        public: expect.arrayContaining([
          {
            key: "lorcana.effect.resolve.optionalSelection.rejected",
            values: {
              playerId: PLAYER_ONE,
              sourceCardId: rapunzelFlynnId,
            },
          },
        ]),
      }),
    );
    expect(testEngine.asPlayerTwo().getCardZone(angelTarget)).toBe("discard");
  });
});
