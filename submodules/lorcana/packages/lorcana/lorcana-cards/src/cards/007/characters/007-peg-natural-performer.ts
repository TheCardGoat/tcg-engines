import type { CharacterCard } from "@tcg/lorcana-types";
import { pegNaturalPerformerI18n } from "./007-peg-natural-performer.i18n";

export const pegNaturalPerformer: CharacterCard = {
  id: "HEg",
  canonicalId: "ci_HEg",
  reprints: ["set7-007"],
  cardType: "character",
  name: "Peg",
  version: "Natural Performer",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  cardNumber: 7,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7085d6eb08764015945d684bc74bceb5",
    tcgPlayer: 619410,
  },
  text: [
    {
      title: "CAPTIVE AUDIENCE",
      description: "{E} — If you have 3 or more other characters in play, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "wsf-1",
      name: "CAPTIVE AUDIENCE",
      cost: {
        exert: true,
      },
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 3,
        excludeSelf: true,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      type: "activated",
      text: "CAPTIVE AUDIENCE {E} — If you have 3 or more other characters in play, draw a card.",
    },
  ],
  i18n: pegNaturalPerformerI18n,
};
