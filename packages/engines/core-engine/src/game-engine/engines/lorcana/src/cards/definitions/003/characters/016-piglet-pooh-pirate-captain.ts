import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pigletPoohPirateCaptain: LorcanitoCharacterCardDefinition = {
  id: "ojq",
  name: "Piglet",
  title: "Pooh Pirate Captain",
  characteristics: ["hero", "dreamborn", "pirate", "captain"],
  text: "**AND I'M THE CAPTAIN!** While you have 2 or more other characters in play, this characters gets +2 {L}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "And I'm the Captain!",
      text: "While you have 2 or more other characters in play, this characters gets +2 {L}.",
      attribute: "lore",
      amount: 2,
      conditions: [
        {
          type: "filter",
          comparison: {
            operator: "gte",
            value: 3,
          },
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
          ],
        },
      ],
    }),
  ],
  flavour: "Ahoy! There's lore out there, and I'm g-gonna find it!",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Grace Tran",
  number: 16,
  set: "ITI",
  rarity: "super_rare",
};
