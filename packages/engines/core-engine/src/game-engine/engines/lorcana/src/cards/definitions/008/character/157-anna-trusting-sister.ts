import { ifYouHaveCharacterNamed } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaTrustingSister: LorcanaCharacterCardDefinition = {
  id: "uws",
  name: "Anna",
  title: "Trusting Sister",
  characteristics: ["storyborn", "hero", "queen"],
  text: "WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "WE CAN DO THIS TOGETHER",
      text: "When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
      conditions: [ifYouHaveCharacterNamed("Elsa")],
      optional: true,
      effects: [
        {
          type: "move",
          to: "inkwell",
          amount: 1,
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              {
                filter: "top-deck",
                value: "self",
              },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 2,
  illustrator: "Samanta Erdini",
  number: 157,
  set: "008",
  rarity: "common",
  lore: 2,
};
