import { opponent } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aladdinStreetRat: LorcanitoCharacterCardDefinition = {
  id: "d9z",

  name: "Aladdin",
  title: "Street Rat",
  characteristics: ["hero", "storyborn"],
  text: "**IMPROVISE** When you play this character each opponent loses 1 lore.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "IMPROVISE",
      text: "When you play this character each opponent loses 1 lore.",
      effects: [
        {
          type: "lore",
          modifier: "subtract",
          amount: 1,
          target: opponent,
        },
      ],
    }),
  ],
  flavour:
    "It can be hard to tell the difference between a diamond in the rough and someone who's just, well, rough.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Peter Brockhammer",
  number: 105,
  set: "TFC",
  rarity: "common",
};
