import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const minimalChar = (
  id: string,
  name: string,
  title: string,
  colors: (
    | "amber"
    | "amethyst"
    | "emerald"
    | "ruby"
    | "sapphire"
    | "steel"
  )[] = ["amber"],
  cost = 1,
  strength = 1,
  willpower = 1,
  lore = 1,
): LorcanaCharacterCardDefinition => ({
  id,
  type: "character",
  name,
  title,
  characteristics: ["storyborn"],
  inkwell: true,
  colors,
  cost,
  strength,
  willpower,
  lore,
  illustrator: "",
  number: 0,
  set: "ROF",
  rarity: "common",
});

export const pinocchioOnTheRun = minimalChar(
  "pinocchioOnTheRun",
  "Pinocchio",
  "On the Run",
);
export const goofyKnightForADay = minimalChar(
  "goofyKnightForADay",
  "Goofy",
  "Knight for a Day",
);
export const chiefBogoRespectedOfficer = minimalChar(
  "chiefBogoRespectedOfficer",
  "Chief Bogo",
  "Respected Officer",
  ["steel"],
  3,
  2,
  3,
  1,
);
export const panicUnderworldImp = minimalChar(
  "panicUnderworldImp",
  "Panic",
  "Underworld Imp",
  ["ruby"],
  2,
  2,
  2,
  1,
);
export const cinderellaBallroomSensation = minimalChar(
  "cinderellaBallroomSensation",
  "Cinderella",
  "Ballroom Sensation",
  ["sapphire"],
  3,
  2,
  3,
  2,
);
export const mickeyMouseFriendlyFace = minimalChar(
  "mickeyMouseFriendlyFace",
  "Mickey Mouse",
  "Friendly Face",
  ["emerald"],
  3,
  2,
  3,
  2,
);
export const cogsworthGrandfatherClock = minimalChar(
  "cogsworthGrandfatherClock",
  "Cogsworth",
  "Grandfather Clock",
  ["steel"],
  2,
  2,
  3,
  1,
);
export const hiramFlavershamToymaker = minimalChar(
  "hiramFlavershamToymaker",
  "Hiram Flaversham",
  "Toymaker",
  ["amethyst"],
  2,
  1,
  2,
  1,
);

// Add only those referenced by failing tests
export const dopeyAlwaysPlayful = minimalChar(
  "dopeyAlwaysPlayful",
  "Dopey",
  "Always Playful",
);
export const eudoraAccomplishedSeamstress = minimalChar(
  "eudoraAccomplishedSeamstress",
  "Eudora",
  "Accomplished Seamstress",
);
export const pachaVillageLeader = minimalChar(
  "pachaVillageLeader",
  "Pacha",
  "Village Leader",
);
export const arthurTrainedSwordsman = minimalChar(
  "arthurTrainedSwordsman",
  "Arthur",
  "Trained Swordsman",
);
export const cheshireCatAlwaysGrinning = minimalChar(
  "cheshireCatAlwaysGrinning",
  "Cheshire Cat",
  "Always Grinning",
  ["amethyst"],
  2,
  2,
  2,
  1,
);
export const feliciaAlwaysHungry = minimalChar(
  "feliciaAlwaysHungry",
  "Felicia",
  "Always Hungry",
);
export const flynnRiderConfidentVagabond = minimalChar(
  "flynnRiderConfidentVagabond",
  "Flynn Rider",
  "Confident Vagabond",
  ["emerald"],
  3,
  2,
  2,
  1,
);
export const littleJohnLoyalFriend = minimalChar(
  "littleJohnLoyalFriend",
  "Little John",
  "Loyal Friend",
  ["amber"],
  3,
  2,
  3,
  1,
);
export const rabbitReluctantHost = minimalChar(
  "rabbitReluctantHost",
  "Rabbit",
  "Reluctant Host",
  ["amber"],
  2,
  1,
  2,
  1,
);
export const ratiganCriminalMastermind = minimalChar(
  "ratiganCriminalMastermind",
  "Ratigan",
  "Criminal Mastermind",
  ["amethyst"],
  4,
  3,
  3,
  2,
);
export const drFacilierSavvyOpportunist = minimalChar(
  "drFacilierSavvyOpportunist",
  "Dr. Facilier",
  "Savvy Opportunist",
  ["amethyst"],
  4,
  3,
  3,
  2,
);
export const owlLogicalLecturer = minimalChar(
  "owlLogicalLecturer",
  "Owl",
  "Logical Lecturer",
  ["sapphire"],
  2,
  1,
  3,
  1,
);
export const donaldDuckNotAgain = minimalChar(
  "donaldDuckNotAgain",
  "Donald Duck",
  "Not Again",
  ["sapphire"],
  3,
  2,
  3,
  1,
);
export const gastonBaritoneBully = minimalChar(
  "gastonBaritoneBully",
  "Gaston",
  "Baritone Bully",
  ["ruby"],
  4,
  3,
  3,
  2,
);
export const herculesHeroInTraining = minimalChar(
  "herculesHeroInTraining",
  "Hercules",
  "Hero in Training",
  ["ruby"],
  4,
  4,
  3,
  2,
);
export const princeJohnGreediestOfAll = minimalChar(
  "princeJohnGreediestOfAll",
  "Prince John",
  "Greediest of All",
  ["emerald"],
  4,
  3,
  4,
  2,
);
export const peterPansShadowNotSewnOn = minimalChar(
  "peterPansShadowNotSewnOn",
  "Peter Pan's Shadow",
  "Not Sewn On",
  ["amethyst"],
  2,
  1,
  2,
  1,
);
