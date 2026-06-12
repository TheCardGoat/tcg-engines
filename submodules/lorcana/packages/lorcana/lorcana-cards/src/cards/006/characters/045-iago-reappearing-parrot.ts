import type { CharacterCard } from "@tcg/lorcana-types";
import { iagoReappearingParrotI18n } from "./045-iago-reappearing-parrot.i18n";

export const iagoReappearingParrot: CharacterCard = {
  id: "Swd",
  canonicalId: "ci_Swd",
  reprints: ["set6-045"],
  cardType: "character",
  name: "Iago",
  version: "Reappearing Parrot",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 45,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_92d831ee2e5b430a9bbbcf7d684bbd57",
    tcgPlayer: 592020,
  },
  text: [
    {
      title: "GUESS WHO",
      description: "When this character is banished in a challenge, return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        target: {
          ref: "self",
        },
        type: "return-to-hand",
      },
      id: "tre-1",
      name: "GUESS WHO",
      sourceZones: ["play", "discard"],
      text: "GUESS WHO When this character is banished in a challenge, return this card to your hand.",
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: iagoReappearingParrotI18n,
};
