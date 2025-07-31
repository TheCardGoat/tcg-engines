import {
  topCardOfOpponentsDeck,
  topCardOfYourDeck,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const friendLikeMe: LorcanaActionCardDefinition = {
  id: "dje",
  name: "Friend Like Me",
  characteristics: ["action", "song"],
  text: "_(A character with cost 5 or more can exert to sing this song for free.)_\n\n\nEach player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Friend Like Me",
      text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: topCardOfYourDeck,
        },
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: topCardOfYourDeck,
        },
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: topCardOfYourDeck,
        },
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: topCardOfOpponentsDeck,
        },
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: topCardOfOpponentsDeck,
        },
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: topCardOfOpponentsDeck,
        },
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
