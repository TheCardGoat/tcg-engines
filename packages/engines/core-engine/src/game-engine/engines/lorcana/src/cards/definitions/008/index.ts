import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export * from "./actions";
export * from "./characters";
export * from "./items";

import {
  beyondTheHorizon,
  candyDrift,
  desperatePlan,
  downInNewOrleans,
  everybodysGotAWeakness,
  fantasticalAndMagical,
  forestDuel,
  getOut,
  headsHeldHigh,
  heWhoStealsAndRunsAway,
  intoTheUnknown,
  itMeansNoWorries,
  lightTheFuse,
  mostEveryonesMadHere,
  nothingWeWontDo,
  onlySoMuchRoom,
  pouncingPractice,
  pullTheLever,
  quickShot,
  shesYourPerson,
  stoppedChaosInItsTracks,
  theyNeverComeBack,
  trialsAndTribulations,
  twitterpated,
  undermine,
  walkThePlank,
  wrongLeverAction,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/actions";

export const all008Cards: LorcanaCardDefinition[] = [
  beyondTheHorizon,
  candyDrift,
  desperatePlan,
  downInNewOrleans,
  everybodysGotAWeakness,
  fantasticalAndMagical,
  forestDuel,
  getOut,
  headsHeldHigh,
  heWhoStealsAndRunsAway,
  intoTheUnknown,
  itMeansNoWorries,
  lightTheFuse,
  mostEveryonesMadHere,
  nothingWeWontDo,
  onlySoMuchRoom,
  pouncingPractice,
  pullTheLever,
  quickShot,
  shesYourPerson,
  stoppedChaosInItsTracks,
  theyNeverComeBack,
  trialsAndTribulations,
  twitterpated,
  undermine,
  walkThePlank,
  wrongLeverAction,
];

export const all008CardsById: Record<string, LorcanaCardDefinition> = {};

for (const card of all008Cards) {
  all008CardsById[card.id] = card;
}
