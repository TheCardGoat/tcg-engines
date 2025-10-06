import type { ScryEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scuttleExpertOnHumans: LorcanaCharacterCardDefinition = {
  id: "r46",
  name: "Scuttle",
  title: "Expert on Humans",
  characteristics: ["storyborn", "ally"],
  text: "**LET ME SEE** When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it in your hand. Put the rest on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "LET ME SEE",
      text: "When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it in your hand. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          amount: 4,
          mode: "bottom",
          shouldRevealTutored: true,
          target: self,
          limits: {
            bottom: 4,
            top: 0,
            inkwell: 0,
            hand: 1,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            { filter: "type", value: "item" },
          ],
        } as ScryEffect,
      ],
    },
  ],
  flavour: "Wow. This is special. This is very, very unusual.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Kapik",
  number: 154,
  set: "URR",
  rarity: "uncommon",
};
