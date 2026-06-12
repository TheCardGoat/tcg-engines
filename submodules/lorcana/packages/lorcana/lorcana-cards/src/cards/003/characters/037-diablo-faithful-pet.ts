import type { CharacterCard } from "@tcg/lorcana-types";
import { diabloFaithfulPetI18n } from "./037-diablo-faithful-pet.i18n";

export const diabloFaithfulPet: CharacterCard = {
  id: "6Jh",
  canonicalId: "ci_6Jh",
  reprints: ["set3-037"],
  cardType: "character",
  name: "Diablo",
  version: "Faithful Pet",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "003",
  cardNumber: 37,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_96b06169bec644898473633766c5e534",
    tcgPlayer: 539068,
  },
  text: [
    {
      title: "LOOKING FOR AURORA",
      description:
        "Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          destinations: [
            {
              zone: "deck-top",
              min: 0,
              max: 1,
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
        },
        type: "optional",
      },
      id: "1tx-1",
      name: "LOOKING FOR AURORA",
      text: "LOOKING FOR AURORA Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          name: "Maleficent",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: diabloFaithfulPetI18n,
};
