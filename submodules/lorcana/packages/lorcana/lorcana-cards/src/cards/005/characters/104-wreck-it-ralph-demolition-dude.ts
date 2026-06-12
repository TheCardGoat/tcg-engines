import type { CharacterCard } from "@tcg/lorcana-types";
import { wreckitRalphDemolitionDudeI18n } from "./104-wreck-it-ralph-demolition-dude.i18n";

export const wreckitRalphDemolitionDude: CharacterCard = {
  id: "N3o",
  canonicalId: "ci_N3o",
  reprints: ["set5-104"],
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Demolition Dude",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 104,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f41934191f364d68bc66e64860cc0c92",
    tcgPlayer: 555259,
  },
  text: [
    {
      title: "REFRESHING BREAK",
      description: "Whenever you ready this character, gain 1 lore for each 1 damage on him.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        amount: {
          type: "damage-on-self",
        },
        type: "gain-lore",
      },
      id: "N3o-1",
      name: "REFRESHING BREAK",
      text: "REFRESHING BREAK Whenever you ready this character, gain 1 lore for each 1 damage on him.",
      trigger: {
        event: "ready",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: wreckitRalphDemolitionDudeI18n,
};
