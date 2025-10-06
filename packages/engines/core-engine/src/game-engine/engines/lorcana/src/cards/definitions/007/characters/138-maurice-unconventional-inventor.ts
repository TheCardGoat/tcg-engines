import type {
  BanishEffect,
  CreateLayerBasedOnTarget,
  TargetConditionalEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import {
  drawACard,
  mayBanish,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import { chosenItemOfYours } from "~/game-engine/engines/lorcana/src/abilities/target";
import { chosenCharacterWithStrengthXorLess } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const afterEffect: CreateLayerBasedOnTarget = {
  type: "create-layer-based-on-target",
  effects: [mayBanish(chosenCharacterWithStrengthXorLess(2))],
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "item" },
      { filter: "owner", value: "self" },
      {
        filter: "attribute",
        value: "name",
        comparison: { operator: "eq", value: "maurice's machine" },
      },
    ],
  },
};

const targetingMauricesMachine: BanishEffect = {
  type: "banish",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "item" },
      { filter: "owner", value: "self" },
      {
        filter: "attribute",
        value: "name",
        comparison: { operator: "eq", value: "maurice's machine" },
      },
    ],
  },
  forEach: [drawACard],
  afterEffect: [afterEffect],
};

const notTargettingMauricesMachine: BanishEffect = {
  type: "banish",
  target: chosenItemOfYours,
  forEach: [drawACard],
};

const newVar: TargetConditionalEffect = {
  type: "target-conditional",
  // move condition to a separate object, so the filter is the same
  effects: [targetingMauricesMachine],
  fallback: [notTargettingMauricesMachine],
  // TODO: Re implement conditional target
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "item" },
      { filter: "owner", value: "self" },
      {
        filter: "attribute",
        value: "name",
        comparison: { operator: "eq", value: "maurice's machine" },
      },
    ],
  },
};

export const mauriceUnconventionalInventor: LorcanaCharacterCardDefinition = {
  id: "mgt",
  name: "Maurice",
  title: "Unconventional Inventor",
  characteristics: ["storyborn", "mentor", "inventor"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 5,
  willpower: 2,
  illustrator: "Andy Estrada / Greg Shrader",
  number: 138,
  set: "007",
  rarity: "rare",
  lore: 1,
  text: "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice’s Machine, you may also banish chosen character with 2 {S} or less.",
  abilities: [
    whenYouPlayThisCharacter({
      name: "How on Earth Did That Happen?",
      text: "When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice’s Machine, you may also banish chosen character with 2 {S} or less.",
      optional: true,
      dependentEffects: true,
      effects: [newVar],
    }),
  ],
};
