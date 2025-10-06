import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverYouPlayASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";

export const recordPlayer: LorcanaItemCardDefinition = {
  id: "jvf",
  name: "Record Player",
  characteristics: ["item"],
  text: "**LOOK AT THIS!** Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.\n\n**HIT PARADE** Your characters named Stitch count as having +1 cost to sing songs.",
  type: "item",
  abilities: [
    wheneverYouPlayASong({
      name: "LOOK AT THIS!",
      text: "Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          modifier: "subtract",
          amount: 2,
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    }),
    propertyStaticAbilities({
      name: "HIT PARADE",
      text: "Your characters named Stitch count as having +1 cost to sing songs.",
      attribute: "singCost",
      amount: 1,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "owner", value: "self" },
          { filter: "zone", value: "play" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "stitch" },
          },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Simone Buonfantino",
  number: 32,
  set: "URR",
  rarity: "common",
};
