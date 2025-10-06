import { returnToHand } from "@lorcanito/lorcana-engine/effects/effects";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kingCandySugarRushNightmare: LorcanaCharacterCardDefinition = {
  id: "sg3",
  name: "King Candy",
  title: "Sugar Rush Nightmare",
  characteristics: ["storyborn", "villain", "king", "racer"],
  text: "A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "A NEW ROSTER",
      text: "When this character is banished, you may return another Racer character card from your discard to your hand.",
      optional: true,
      effects: [
        returnToHand({
          excludeSelf: true,
          filters: [
            { filter: "type", value: "character" },
            { filter: "owner", value: "self" },
            { filter: "characteristics", value: ["racer"] },
          ],
        }),
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber", "ruby"],
  cost: 3,
  strength: 3,
  willpower: 2,
  illustrator: "Joseph Buening",
  number: 23,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
