import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { thisCard } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { FilterCondition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";

const filterCondition: FilterCondition = {
  type: "filter",
  filters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "characteristics", value: ["hero"] },
  ],
  comparison: {
    operator: "gt",
    value: 0,
  },
};
const ourBottleWorked = {
  type: "static",
  ability: "gain-ability",
  name: "OUR BOTTLE WORKED!",
  text: "While you have a Hero character in play, this character gains Ward. (Opponents can't choose them except to challenge.)",
  target: thisCard,
  gainedAbility: wardAbility,
  conditions: [filterCondition],
};

export const pennyTheOrphanCleverChild: LorcanitoCharacterCard = {
  id: "zor",
  name: "Penny The Orphan",
  title: "Clever Child",
  characteristics: ["storyborn", "ally"],
  text: "OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward. (Opponents can't choose them except to challenge.)",
  type: "character",
  abilities: [ourBottleWorked],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 1,
  illustrator: "Otto Paredes",
  number: 171,
  set: "007",
  rarity: "common",
  lore: 2,
};
