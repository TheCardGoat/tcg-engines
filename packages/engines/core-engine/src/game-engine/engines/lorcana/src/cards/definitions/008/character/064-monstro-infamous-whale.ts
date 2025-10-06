import { allCardsInYourDeck } from "@lorcanito/lorcana-engine/abilities/amounts";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
import {
  type ActivatedAbility,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fullBreachAndMoneyEverywhereCombo: ActivatedAbility = {
  type: "activated",
  name: "FULL BREACH + MONEY EVERYWHERE COMBO",
  text: "Draw your whole deck, discard that many cards.",
  optional: false,
  resolveEffectsIndividually: true,
  resolveAmountBeforeCreatingLayer: true,
  costs: [],
  effects: [
    {
      type: "draw",
      amount: allCardsInYourDeck,
      target: self,
    },
    {
      type: "discard",
      amount: allCardsInYourDeck,
      target: {
        type: "card",
        value: allCardsInYourDeck,
        filters: [
          { filter: "zone", value: "hand" },
          { filter: "owner", value: "self" },
        ],
      },
    },
  ],
};

export const fullBreach: ActivatedAbility = {
  type: "activated",
  name: "FULL BREACH",
  text: "Choose and discard a card - Ready this character. He can't quest for the rest of this turn.",
  optional: false,
  costs: [
    {
      type: "card",
      action: "discard",
      amount: 1,
      filters: [
        { filter: "zone", value: "hand" },
        { filter: "owner", value: "self" },
      ],
    },
  ],
  effects: [
    ...readyAndCantQuest(
      {
        type: "card",
        value: "all",
        filters: [{ filter: "source", value: "self" }],
      },
      true,
    ),
  ],
};

export const monstroInfamousWhale: LorcanaCharacterCardDefinition = {
  id: "oa8",
  name: "Monstro",
  title: "Infamous Whale",
  characteristics: ["storyborn"],
  text: "Rush (This character can challenge the turn they're played.)\nFULL BREACH Choose and discard a card - Ready this character. He can't quest for the rest of this turn.",
  type: "character",
  abilities: [rushAbility, fullBreach],
  inkwell: true,
  colors: ["amethyst"],
  cost: 8,
  strength: 6,
  willpower: 8,
  illustrator: "Alexandria Neonakis",
  number: 64,
  set: "008",
  rarity: "rare",
  lore: 2,
};
