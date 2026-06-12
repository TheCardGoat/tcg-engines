import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyTremaineOverbearingMatriarchI18n } from "./111-lady-tremaine-overbearing-matriarch.i18n";

export const ladyTremaineOverbearingMatriarch: CharacterCard = {
  id: "B8N",
  canonicalId: "ci_B8N",
  reprints: ["set2-111"],
  cardType: "character",
  name: "Lady Tremaine",
  version: "Overbearing Matriarch",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 111,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5c953b299f3b4de08ff77ddd3b041270",
    tcgPlayer: 522698,
  },
  text: [
    {
      title: "NOT FOR YOU",
      description:
        "When you play this character, each opponent with more lore than you loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        type: "for-each-opponent",
        condition: {
          type: "comparison",
          left: { type: "lore", controller: "opponent" },
          comparison: "greater",
          right: { type: "lore", controller: "you" },
        },
        effect: {
          type: "lose-lore",
          amount: 1,
          target: "OPPONENT",
        },
      },
      id: "r0v-1",
      name: "NOT FOR YOU",
      text: "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: ladyTremaineOverbearingMatriarchI18n,
};
