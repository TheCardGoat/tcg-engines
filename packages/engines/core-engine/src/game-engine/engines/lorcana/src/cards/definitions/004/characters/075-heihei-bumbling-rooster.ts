import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heiheiBumblingRooster: LorcanaCharacterCardDefinition = {
  id: "rmn",
  reprints: ["yeh"],
  name: "Heihei",
  title: "Bumbling Rooster",
  characteristics: ["storyborn", "ally"],
  text: "**LET'S FATTEN YOU UP** When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Let's Fatten You Up",
      text: "When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
      optional: true,
      effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
      resolutionConditions: [
        {
          type: "filter",
          filters: [
            { filter: "owner", value: "opponent" },
            { filter: "zone", value: "inkwell" },
          ],
          comparison: {
            operator: "gt",
            value: {
              dynamic: true,
              filters: [
                { filter: "owner", value: "self" },
                { filter: "zone", value: "inkwell" },
              ],
            },
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Anna Stoski",
  number: 75,
  set: "URR",
  rarity: "uncommon",
};
