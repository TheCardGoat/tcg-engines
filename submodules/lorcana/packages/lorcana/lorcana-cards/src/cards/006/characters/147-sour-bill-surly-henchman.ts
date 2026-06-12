import type { CharacterCard } from "@tcg/lorcana-types";
import { sourBillSurlyHenchmanI18n } from "./147-sour-bill-surly-henchman.i18n";

export const sourBillSurlyHenchman: CharacterCard = {
  id: "IpU",
  canonicalId: "ci_IpU",
  reprints: ["set6-147"],
  cardType: "character",
  name: "Sour Bill",
  version: "Surly Henchman",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 147,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6e547f6533974321a1eb89579e98cac0",
    tcgPlayer: 591983,
  },
  text: [
    {
      title: "UNPALATABLE",
      description: "When you play this character, chosen opposing character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "1f5-1",
      name: "UNPALATABLE",
      text: "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: sourBillSurlyHenchmanI18n,
};
