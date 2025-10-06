import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hadesKingOfOlympus: LorcanaCharacterCardDefinition = {
  id: "j9i",
  name: "Hades",
  title: "King of Olympus",
  characteristics: ["floodborn", "villain", "king", "deity"],
  text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Hades._)\n**Sinister plot** This character gets +1 {L} for every other Villain character you have in play.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "Sinister plot",
      text: "This character gets +1 {L} for every other Villain character you have in play.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          modifier: "add",
          target: thisCharacter,
          amount: {
            dynamic: true,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              { filter: "characteristics", value: ["villain"] },
            ],
          },
        },
      ],
    },
    shiftAbility(6, "Hades"),
  ],
  flavour: "Oh hey, I'm gonna need new business cards.",
  colors: ["amber"],
  cost: 8,
  strength: 6,
  willpower: 7,
  lore: 1,
  illustrator: "Alex Accorsi",
  number: 5,
  set: "TFC",
  rarity: "rare",
};
