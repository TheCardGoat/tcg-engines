import {
  putTheRestOnTheBottomOfYourDeckInAnyOrder,
  type ScryEffect,
  youMayRevealACharacterCardAndPutItIntoYourHand,
} from "~/game-engine/engines/lorcana/src/abilities/effect/scry";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const beOurGuestEffect: ScryEffect = {
  type: "scry",
  parameters: {
    lookAt: 4,
    destinations: [
      youMayRevealACharacterCardAndPutItIntoYourHand,
      putTheRestOnTheBottomOfYourDeckInAnyOrder,
    ],
  },
};

export const beOurGuest: LorcanaActionCardDefinition = {
  id: "m6n",
  name: "Be Our Guest",
  characteristics: ["action", "song"],
  text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      effects: [beOurGuestEffect],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "R. La Barbera / L. Giammichele",
  number: 25,
  set: "TFC",
  rarity: "uncommon",
};
