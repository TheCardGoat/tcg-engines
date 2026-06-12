import type { CharacterCard } from "@tcg/lorcana-types";
import { lenaSabrewingMysteriousDuckI18n } from "./042-lena-sabrewing-mysterious-duck.i18n";

export const lenaSabrewingMysteriousDuck: CharacterCard = {
  id: "9B6",
  canonicalId: "ci_9B6",
  reprints: ["set10-042"],
  cardType: "character",
  name: "Lena Sabrewing",
  version: "Mysterious Duck",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 42,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_041e41c6ea3349e6a3734dd749f9543e",
    tcgPlayer: 658457,
  },
  text: [
    {
      title: "ARCANE CONNECTION",
      description:
        "When you play this character, if you have a character or location in play with a card under them, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Sorcerer"],
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a character or location in play with a card under them",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "ejj-1",
      name: "ARCANE CONNECTION",
      text: "ARCANE CONNECTION When you play this character, if you have a character or location in play with a card under them, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: lenaSabrewingMysteriousDuckI18n,
};
