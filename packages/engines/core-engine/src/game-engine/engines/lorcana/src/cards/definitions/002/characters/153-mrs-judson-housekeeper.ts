import { wheneverYouPlayAFloodBorn } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrsJudsonHousekeeper: LorcanitoCharacterCardDefinition = {
  id: "rqb",

  name: "Mrs. Judson",
  title: "Housekeeper",
  characteristics: ["storyborn", "ally"],
  text: "**TIDY UP** Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    wheneverYouPlayAFloodBorn({
      name: "Tidy Up",
      text: "Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [{ filter: "top-deck", value: "self" }],
          },
        },
      ],
    }),
  ],
  flavour:
    '"I know just the thing. Let me fetch you a pot of tea and some of my fresh cheese crumpets."',
  colors: ["sapphire"],
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  illustrator: "Michaela Martin",
  number: 153,
  set: "ROF",
  rarity: "rare",
};
