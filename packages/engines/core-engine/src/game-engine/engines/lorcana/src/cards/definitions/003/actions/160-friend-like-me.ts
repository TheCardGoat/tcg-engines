import { putCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const friendLikeMe: LorcanaActionCardDefinition = {
  id: "dje",
  name: "Friend Like Me",
  characteristics: ["action", "song"],
  text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
      effects: [
        putCardEffect({
          to: "inkwell",
          from: "deck",
          position: "top",
          targets: [
            {
              type: "card",
              zone: "deck",
              owner: "self",
              count: 3,
            },
          ],
        }),
        putCardEffect({
          to: "inkwell",
          from: "deck",
          position: "top",
          targets: [
            {
              type: "card",
              zone: "deck",
              owner: "opponent",
              count: 3,
            },
          ],
        }),
      ],
    },
  ],
  flavour: "You got some power in your corner now",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  illustrator: "Emily Abeydeera",
  number: 160,
  set: "ITI",
  rarity: "rare",
};
