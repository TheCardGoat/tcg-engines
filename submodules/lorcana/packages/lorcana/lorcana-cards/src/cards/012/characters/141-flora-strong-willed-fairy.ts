import type { CharacterCard } from "@tcg/lorcana-types";
import { floraStrongwilledFairyI18n } from "./141-flora-strong-willed-fairy.i18n";

export const floraStrongwilledFairy: CharacterCard = {
  id: "RW9",
  canonicalId: "ci_RW9",
  reprints: ["set12-141"],
  cardType: "character",
  name: "Flora",
  version: "Strong-Willed Fairy",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "012",
  cardNumber: 141,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_aaea685bf107411087af5025359f986f",
  },
  text: [
    {
      title: "LUMINOUS SHELTER",
      description:
        "When you play this character, your other characters gain Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [
    {
      id: "RW9-1",
      name: "LUMINOUS SHELTER",
      type: "triggered",
      text: "LUMINOUS SHELTER When you play this character, your other characters gain Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        duration: "until-start-of-next-turn",
        target: "YOUR_OTHER_CHARACTERS",
      },
    },
  ],
  i18n: floraStrongwilledFairyI18n,
};
