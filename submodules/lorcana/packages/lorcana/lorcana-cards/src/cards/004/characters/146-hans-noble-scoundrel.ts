import type { CharacterCard } from "@tcg/lorcana-types";
import { hansNobleScoundrelI18n } from "./146-hans-noble-scoundrel.i18n";

export const hansNobleScoundrel: CharacterCard = {
  id: "fmb",
  canonicalId: "ci_nNC",
  reprints: ["set4-146", "set9-148"],
  cardType: "character",
  name: "Hans",
  version: "Noble Scoundrel",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 146,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_34956960ca9c4048b6d2887bb9ca7446",
    tcgPlayer: 650083,
  },
  text: [
    {
      title: "ROYAL SCHEMES",
      description:
        "When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
  abilities: [
    {
      condition: {
        type: "or",
        conditions: [
          {
            type: "has-character-with-classification",
            classification: "Princess",
            controller: "any",
          },
          {
            type: "has-character-with-classification",
            classification: "Queen",
            controller: "any",
          },
        ],
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "1wq-1",
      name: "ROYAL SCHEMES",
      text: "ROYAL SCHEMES When you play this character, if a Princess or Queen character is in play, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: hansNobleScoundrelI18n,
};
