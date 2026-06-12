import type { CharacterCard } from "@tcg/lorcana-types";
import { cobraBubblesFormerCiaI18n } from "./188-cobra-bubbles-former-cia.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const cobraBubblesFormerCia: CharacterCard = {
  id: "xkL",
  canonicalId: "ci_xkL",
  reprints: ["set6-188"],
  cardType: "character",
  name: "Cobra Bubbles",
  version: "Former CIA",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 188,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0e199ab83f22428784550f317e16fefd",
    tcgPlayer: 592010,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "THINK ABOUT WHAT'S BEST 2",
      description: "{I} — Draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    bodyguard,
    {
      cost: {
        exert: true,
      },
      id: "1r8-2",
      name: "THINK ABOUT WHAT'S BEST 2",
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
            type: "discard",
          },
        ],
        type: "sequence",
      },
      text: "THINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.",
      type: "activated",
    },
  ],
  i18n: cobraBubblesFormerCiaI18n,
};
