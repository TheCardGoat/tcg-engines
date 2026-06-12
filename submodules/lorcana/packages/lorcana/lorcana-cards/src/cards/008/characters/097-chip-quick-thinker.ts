import type { CharacterCard } from "@tcg/lorcana-types";
import { chipQuickThinkerI18n } from "./097-chip-quick-thinker.i18n";

export const chipQuickThinker: CharacterCard = {
  id: "oOq",
  canonicalId: "ci_oOq",
  reprints: ["set8-097"],
  cardType: "character",
  name: "Chip",
  version: "Quick Thinker",
  inkType: ["emerald"],
  franchise: "Rescue Rangers",
  set: "008",
  cardNumber: 97,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_51597c28f0b444a6a4cf319ff579c839",
    tcgPlayer: 631346,
  },
  text: [
    {
      title: "I'LL HANDLE THIS",
      description: "When you play this character, chosen opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        from: "hand",
        target: "OPPONENT",
        type: "discard",
      },
      id: "1aq-1",
      name: "I'LL HANDLE THIS",
      text: "I'LL HANDLE THIS When you play this character, chosen opponent chooses and discards a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: chipQuickThinkerI18n,
};
