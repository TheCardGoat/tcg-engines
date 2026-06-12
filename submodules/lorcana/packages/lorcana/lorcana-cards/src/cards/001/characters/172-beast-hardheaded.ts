import type { CharacterCard } from "@tcg/lorcana-types";
import { beastHardheadedI18n } from "./172-beast-hardheaded.i18n";

export const beastHardheaded: CharacterCard = {
  id: "VIG",
  canonicalId: "ci_VIG",
  reprints: ["set1-172"],
  cardType: "character",
  name: "Beast",
  version: "Hardheaded",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 172,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9600ba030e244c31becf34a3bf0822af",
    tcgPlayer: 508900,
  },
  text: [
    {
      title: "BREAK",
      description: "When you play this character, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "m8v-1",
      name: "BREAK",
      text: "BREAK When you play this character, you may banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: beastHardheadedI18n,
};
