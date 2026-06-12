import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyFamilyDogI18n } from "./011-lady-family-dog.i18n";

export const ladyFamilyDog: CharacterCard = {
  id: "XlN",
  canonicalId: "ci_XlN",
  reprints: ["set8-011"],
  cardType: "character",
  name: "Lady",
  version: "Family Dog",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "008",
  cardNumber: 11,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5cad0c55b4644a3ea12fff8717e5fe83",
    tcgPlayer: 631355,
  },
  text: [
    {
      title: "SOMEONE TO CARE FOR",
      description:
        "When you play this character, you may play a character with cost 2 or less for free.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 2,
          },
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "ri7-1",
      name: "SOMEONE TO CARE FOR",
      text: "SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: ladyFamilyDogI18n,
};
