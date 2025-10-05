import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export * from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";

import {
  ambush,
  aVeryMerryUnbirthday,
  energyBlast,
  goodJob,
  heffalumpsAndWoozles,
  helpingHand,
  hotPotato,
  imStillHere,
  iWontGiveIn,
  loseTheWay,
  makeSomeMagic,
  mosquitoBite,
  prepareToBoard,
  prepareYourBot,
  rescueRangersAway,
  safeAndSound,
  sailTheAzuriteSea,
  seekingTheHalfCrown,
  showTheWay,
  submitToMyWill,
  theIslandsIPulledFromTheSea,
  thievery,
  twinFire,
  unfortunateSituation,
  weCouldBeImmortals,
  youCameBack,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";

export const microbots = { id: "microbots" };
export const yokaiScientificSupervillain = {
  id: "yokaiScientificSupervillain",
};
export const mauiHalfshark = { id: "mauiHalfshark" };
export const jimHawkinsRiggerSpecialist = { id: "jimHawkinsRiggerSpecialist" };
export const gadgetHackwrenchPerceptiveMouse = {
  id: "gadgetHackwrenchPerceptiveMouse",
};
export const nickWildeCleverFox = { id: "nickWildeCleverFox" };
export const mammaOdieLoneSage: LorcanitoCharacterCard = {
  id: "dhe",
  missingTestCase: true,
  notImplemented: true, // wheneverYouPlayASong ability not yet implemented
  name: "Mama Odie",
  title: "Solitary Sage",
  characteristics: ["storyborn", "ally", "sorcerer"],
  text: "I HAVE TO DO EVERYTHING AROUND HERE Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.",
  type: "character",
  abilities: [
    // TODO: Implement wheneverYouPlayASong triggered ability
    // wheneverYouPlayASong({
    //   name: "I Have To Do Everything Around Here",
    //   text: "Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.",
    //   effects: [
    //     moveDamageEffect({
    //       amount: 2,
    //       from: chosenCharacter,
    //       to: chosenOpposingCharacter,
    //     }),
    //   ],
    // }),
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  illustrator: "Mel Milton",
  number: 57,
  set: "006",
  rarity: "rare",
};

export const owlPirateLookout = { id: "owlPirateLookout" };
export const goofyExpertShipwright = { id: "goofyExpertShipwright" };
export const principeNaveenCarefreeExplorer = {
  id: "principeNaveenCarefreeExplorer",
};
export const simbaHappygolucky = { id: "simbaHappygolucky" };
export const sugarRushSpeedwayFinishLine = {
  id: "sugarRushSpeedwayFinishLine",
};

export const all006Cards: LorcanaCardDefinition[] = [
  ambush,
  aVeryMerryUnbirthday,
  energyBlast,
  goodJob,
  heffalumpsAndWoozles,
  helpingHand,
  hotPotato,
  imStillHere,
  iWontGiveIn,
  loseTheWay,
  makeSomeMagic,
  mosquitoBite,
  prepareToBoard,
  prepareYourBot,
  rescueRangersAway,
  safeAndSound,
  sailTheAzuriteSea,
  seekingTheHalfCrown,
  showTheWay,
  submitToMyWill,
  theIslandsIPulledFromTheSea,
  thievery,
  twinFire,
  unfortunateSituation,
  weCouldBeImmortals,
  youCameBack,
];

export const all006CardsById: Record<string, LorcanaCardDefinition> = {};
for (const card of all006Cards) {
  all006CardsById[card.id] = card;
}

// Minimal 006 character referenced by tests
export const liloEscapeArtist = { id: "liloEscapeArtist" } as any;
