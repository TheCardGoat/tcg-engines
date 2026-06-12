import type { CharacterCard } from "@tcg/lorcana-types";
import { diabloObedientRavenI18n } from "./049-diablo-obedient-raven.i18n";

export const diabloObedientRaven: CharacterCard = {
  id: "kjK",
  canonicalId: "ci_kjK",
  reprints: ["set6-049"],
  cardType: "character",
  name: "Diablo",
  version: "Obedient Raven",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "006",
  cardNumber: 49,
  rarity: "uncommon",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1419caf47da54560bbafd279ca6cfc4b",
    tcgPlayer: 588337,
  },
  text: [
    {
      title: "FLY, MY PET!",
      description: "When this character is banished, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1vn-1",
      name: "FLY, MY PET!",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "FLY, MY PET! When this character is banished, you may draw a card.",
    },
  ],
  i18n: diabloObedientRavenI18n,
};
