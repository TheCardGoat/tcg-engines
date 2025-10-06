import { whileYouHaveTwoOrMoreCharactersExerted } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
import {
  evasiveAbility,
  type StaticAbilityWithEffect,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const recklessRun: StaticAbilityWithEffect = {
  type: "static",
  ability: "effects",
  name: "RECKLESS RUN",
  text: "While you have 2 or more characters exerted, this character gets +2 {S} and Evasive.",
  conditions: [whileYouHaveTwoOrMoreCharactersExerted],
  effects: [thisCharacterGetsStrength(2)],
};

export const theCoachmanGreedyDeceiver: LorcanaCharacterCardDefinition = {
  id: "q0h",
  name: "The Coachman",
  title: "Greedy Deceiver",
  characteristics: ["storyborn", "villain"],
  text: "RECKLESS RUN While you have 2 or more characters exerted, this character gets +2 {S} and Evasive. (Only characters with Evasive can challenge this character.)",
  type: "character",
  abilities: [
    recklessRun,
    {
      ...evasiveAbility,
      conditions: [whileYouHaveTwoOrMoreCharactersExerted],
    },
  ],
  inkwell: true,
  colors: ["ruby", "steel"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Filipe Lourentino",
  number: 140,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
