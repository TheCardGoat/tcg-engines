import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const moanChosenByTheOcean: LorcanaCharacterCardDefinition = {
  id: "w14",
  name: "Moana",
  title: "Chosen by the Ocean",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**THIS IS NOT WHO YOU ARE** When you play this character, you may banish chosen character named Te Ka.",
  type: "character",
  illustrator: "Tanisha Cherislin",
  abilities: [
    whenYouPlayThisCharAbility({
      optional: true,
      name: "THIS IS NOT WHO YOU ARE",
      text: "When you play this character, you may banish chosen character named Te Ka.",
      type: "resolution",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "Te Ka" },
              },
            ],
          },
        },
      ],
    }),
  ],
  flavour: "You know who you are.",
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  number: 117,
  set: "TFC",
  rarity: "uncommon",
};
