import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const sumerianTalisman: LorcanaItemCardDefinition = {
  id: "ui2",
  missingTestCase: true,
  name: "Sumerian Talisman",
  characteristics: ["item"],
  text: "**SOURCE OF MAGIC** During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
  type: "item",
  abilities: [
    wheneverOneOfYourCharactersIsBanishedInAChallenge({
      name: "Source of Magic",
      text: "During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
      optional: true,
      conditions: [{ type: "during-turn", value: "self" }],
      triggerFilter: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
      ],
      effects: [drawACard],
    }),
  ],
  flavour:
    "Summoned spirit from the dark \nShow thyself before this arc. \n−Lena Sabrewing",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  illustrator: "Adam Bunch",
  number: 133,
  set: "ITI",
  rarity: "uncommon",
};
