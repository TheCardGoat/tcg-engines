import type {
  CardEffectTarget,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { ifThisCharacterIsExerted } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { sourceTarget } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  discardTwoCards,
  drawXCards,
  mayBanish,
} from "@lorcanito/lorcana-engine/effects/effects";

const chosenAllyOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
    { filter: "zone", value: "play" },
    {
      filter: "characteristics",
      value: ["ally"],
    },
  ],
};

export const scarFinallyKing: LorcanitoCharacterCardDefinition = {
  id: "sfk",
  name: "Scar",
  title: "Finally King",
  characteristics: ["storyborn", "villain"],
  text: "BE GRATEFUL Your Ally characters get +1 {S}.\nSTICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of a chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.",
  type: "character",
  colors: ["steel"],
  cost: 5,
  strength: 5,
  willpower: 4,
  illustrator: "",
  number: 175,
  set: "009",
  rarity: "common",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "BE GRATEFUL",
      text: "Your Ally characters get +1 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["ally"] },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
    atTheEndOfYourTurn({
      name: "STICK WITH ME",
      text: "At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of a chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.",
      optional: true,
      conditions: [ifThisCharacterIsExerted],
      effects: [
        {
          type: "create-layer-based-on-target",
          target: chosenAllyOfYours,
          resolveEffectsIndividually: true,
          resolveAmountBeforeCreatingLayer: true,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: chosenAllyOfYours,
              replaceEffectTarget: true,
              effects: [mayBanish(sourceTarget)],
            },
          ],
          effects: [
            drawXCards({
              dynamic: true,
              target: { attribute: "strength" },
            }),
            discardTwoCards,
          ],
        },
      ],
    }),
  ],
  lore: 2,
};
