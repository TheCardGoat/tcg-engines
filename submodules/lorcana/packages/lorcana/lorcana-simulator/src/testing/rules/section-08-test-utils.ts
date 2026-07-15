import { expect } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";

export function resolveOnlyBagEffect(
  testEngine: LorcanaMultiplayerTestEngine,
  params:
    | Parameters<ReturnType<LorcanaMultiplayerTestEngine["asPlayerOne"]>["resolveBag"]>[1]
    | undefined = undefined,
): void {
  const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
  expect(bagEffect).toBeDefined();

  const resolvingPlayer =
    bagEffect!.chooserId === PLAYER_ONE ? testEngine.asPlayerOne() : testEngine.asPlayerTwo();

  expect(resolvingPlayer.resolveBag(bagEffect!.id, params)).toBeSuccessfulCommand();
}

export const alertAttacker = createMockCharacter({
  id: "section-08-alert-attacker",
  name: "Alert Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [{ id: "section-08-alert", type: "keyword", keyword: "Alert", text: "Alert" }],
});

export const evasiveDefender = createMockCharacter({
  id: "section-08-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [{ id: "section-08-evasive", type: "keyword", keyword: "Evasive", text: "Evasive" }],
});

export const challengerAttacker = createMockCharacter({
  id: "section-08-challenger-attacker",
  name: "Challenger Attacker",
  cost: 2,
  strength: 1,
  willpower: 4,
  abilities: [
    {
      id: "section-08-challenger",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2",
    },
  ],
});

export const supportTarget = createMockCharacter({
  id: "section-08-support-target",
  name: "Support Target",
  cost: 2,
  strength: 1,
  willpower: 4,
});

export const rushAttacker = createMockCharacter({
  id: "section-08-rush-attacker",
  name: "Rush Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [{ id: "section-08-rush", type: "keyword", keyword: "Rush", text: "Rush" }],
});

export const bodyguardEvasiveDefender = createMockCharacter({
  id: "section-08-bodyguard-evasive-defender",
  name: "Bodyguard Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "section-08-bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "section-08-bodyguard-evasive",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
});

export const recklessCantChallengeCharacter = createMockCharacter({
  id: "section-08-reckless-cant-challenge",
  name: "Reckless Can't Challenge",
  cost: 2,
  strength: 3,
  willpower: 3,
  abilities: [
    { id: "section-08-reckless-keyword", type: "keyword", keyword: "Reckless", text: "Reckless" },
  ],
});

export const johnSmithStyleRecklessCharacter = createMockCharacter({
  id: "section-08-john-smith-style-reckless",
  name: "John Smith Style Reckless",
  cost: 2,
  strength: 2,
  willpower: 4,
  abilities: [
    {
      id: "section-08-john-smith-style-reckless-keyword",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
  ],
});

export const cantChallengeThisTurn = createMockSong({
  id: "section-08-cant-challenge-this-turn",
  name: "Can't Challenge This Turn",
  cost: 1,
  text: "You can't challenge this turn.",
  abilities: [
    {
      id: "section-08-cant-challenge-this-turn-effect",
      type: "action",
      text: "You can't challenge this turn.",
      effect: {
        type: "restriction",
        target: "CONTROLLER",
        duration: "this-turn",
        restriction: "cant-challenge",
      },
    },
  ],
});
