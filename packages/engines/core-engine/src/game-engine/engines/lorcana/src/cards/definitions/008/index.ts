import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export * from "./actions";

import {
  onlySoMuchRoom,
  pouncingPractice,
  pullTheLever,
  quickShot,
  theyNeverComeBack,
  trialsAndTribulations,
  twitterpated,
  undermine,
  walkThePlank,
  wrongLeverAction,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/actions";

export const dalmatianPuppyTailWagger = { id: "dalmatianPuppyTailWagger" };
export const deweyLovableShowoff = { id: "deweyLovableShowoff" };
export const khanWarHorse = { id: "khanWarHorse" };
export const patchPlayfulPup = { id: "patchPlayfulPup" };
export const generalLiHeadOfTheImperialArmy = {
  id: "generalLiHeadOfTheImperialArmy",
};
export const jumbaJookibaCriticalScientist = {
  id: "jumbaJookibaCriticalScientist",
};
export const puaProtectivePig = { id: "puaProtectivePig" };
export const televisionSet = { id: "televisionSet" };
export const tianaNaturalTalent = { id: "tianaNaturalTalent" };
export const mickeyMouseGiantMouse = { id: "mickeyMouseGiantMouse" };
export const atlanteanCrystal = { id: "atlanteanCrystal" };
export const nothingWeWontDo = { id: "nothingWeWontDo", cost: 2 };
export const mostEveryonesMadHere = { id: "mostEveryonesMadHere" };
export const lightTheFuse = { id: "lightTheFuse" };
export const getOut = { id: "getOut" };
export const headsHeldHigh = { id: "headsHeldHigh" };
export const heWhoStealsAndRunsAway = { id: "heWhoStealsAndRunsAway" };
export const intoTheUnknown = { id: "intoTheUnknown" };
export const itMeansNoWorries = { id: "itMeansNoWorries" };
export const forestDuel = { id: "forestDuel" };
export const fantasticalAndMagical = { id: "fantasticalAndMagical" };
export const patchPlayfulPup2 = { id: "patchPlayfulPup2" };
export const louisEndearingAlligator = { id: "louisEndearingAlligator" };
export const madDogKarnagesFirstMate = { id: "madDogKarnagesFirstMate" };
export const napoleonCleverBloodhound = { id: "napoleonCleverBloodhound" };
export const honeyLemonCostumedCatalyst = {};
export const fredMajorScienceEnthusiast = {};

export const all008Cards: LorcanaCardDefinition[] = [
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
