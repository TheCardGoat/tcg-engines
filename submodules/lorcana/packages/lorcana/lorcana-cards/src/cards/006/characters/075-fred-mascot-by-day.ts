import type { CharacterCard } from "@tcg/lorcana-types";
import { fredMascotByDayI18n } from "./075-fred-mascot-by-day.i18n";

export const fredMascotByDay: CharacterCard = {
  id: "z1w",
  canonicalId: "ci_z1w",
  reprints: ["set6-075"],
  cardType: "character",
  name: "Fred",
  version: "Mascot by Day",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 75,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9cbf437511cf41c7b61f04f01a22c39e",
    tcgPlayer: 578186,
  },
  text: [
    {
      title: "HOW COOL IS THAT",
      description: "Whenever this character is challenged, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1h1-1",
      name: "HOW COOL IS THAT",
      text: "HOW COOL IS THAT Whenever this character is challenged, gain 2 lore.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: fredMascotByDayI18n,
};
