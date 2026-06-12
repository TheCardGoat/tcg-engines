import type { CharacterCard } from "@tcg/lorcana-types";
import { alistairKreiAmbitiousEntrepreneurI18n } from "./087-alistair-krei-ambitious-entrepreneur.i18n";

export const alistairKreiAmbitiousEntrepreneur: CharacterCard = {
  id: "kZO",
  canonicalId: "ci_kZO",
  reprints: ["set6-087"],
  cardType: "character",
  name: "Alistair Krei",
  version: "Ambitious Entrepreneur",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 87,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c089296aad2d4e4c86c0225be686795b",
    tcgPlayer: 588368,
  },
  text: [
    {
      title: "AN EYE FOR TECH",
      description: "When you play this character, if an opponent has an item in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Inventor"],
  abilities: [
    {
      effect: {
        condition: {
          expression: "an opponent has an item in play",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "ppn-1",
      name: "AN EYE FOR TECH",
      text: "AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: alistairKreiAmbitiousEntrepreneurI18n,
};
