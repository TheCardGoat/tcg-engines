import type {
  LorcanitoCharacterCard,
  PlayEffect,
} from "@lorcanito/lorcana-engine";
import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";

export const princeNaveenUkulelePlayer: LorcanitoCharacterCardDefinition = {
  id: "mnj",
  name: "Prince Naveen",
  title: "Ukulele Player",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**Singer 6** _(This character counts as cost 6 to sing songs.)_\n**IT'S BEAUTIFUL NO?** When you play this character, you may play a song with cost 6 or less for free.",
  type: "character",
  abilities: [
    singerAbility(6),
    {
      type: "resolution",
      optional: true,
      name: "IT'S BEAUTIFUL NO?",
      text: "When you play this character, you may play a song with cost 6 or less for free.",
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
              { filter: "characteristics", value: ["song"] },
              {
                filter: "attribute",
                value: "cost",
                ignoreBonuses: true,
                comparison: { operator: "lte", value: 6 },
              },
            ],
          },
        } as PlayEffect,
      ],
    },
  ],
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Rosa la Barbera / Livio Cacciatore",
  number: 3,
  set: "SSK",
  rarity: "legendary",
};
