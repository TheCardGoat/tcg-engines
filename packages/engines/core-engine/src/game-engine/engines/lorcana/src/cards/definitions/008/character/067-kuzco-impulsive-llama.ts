import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kuzcoImpulsiveLlama: LorcanaCharacterCardDefinition = {
  id: "fo7",
  name: "Kuzco",
  title: "Impulsive Llama",
  characteristics: ["floodborn", "king"],
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Kuzco.)\nWHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
  type: "character",
  abilities: [
    shiftAbility(4, "Kuzco"),
    whenYouPlayThisCharacter({
      name: "WHAT DOES THIS DO?",
      text: "When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
      responder: "opponent",
      effects: [
        {
          type: "move",
          to: "deck",
          bottom: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
        },
        drawACard,
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst", "emerald"],
  cost: 7,
  strength: 5,
  willpower: 5,
  illustrator: "Kendall Hale",
  number: 67,
  set: "008",
  rarity: "rare",
  lore: 2,
};
