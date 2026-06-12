import type { CharacterCard } from "@tcg/lorcana-types";
import { jetsamOpportunisticEelI18n } from "./077-jetsam-opportunistic-eel.i18n";

export const jetsamOpportunisticEel: CharacterCard = {
  id: "5xx",
  canonicalId: "ci_5xx",
  reprints: ["set10-077"],
  cardType: "character",
  name: "Jetsam",
  version: "Opportunistic Eel",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "010",
  cardNumber: 77,
  rarity: "common",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9228d591151a4ba0a1e577d19d9e38f9",
    tcgPlayer: 659462,
  },
  text: [
    {
      title: "AMBUSH FROM THE DEEP",
      description:
        "When you play this character, deal 3 damage to chosen opposing damaged character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 3,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
          filter: [{ type: "status", status: "damaged" }],
        },
        type: "deal-damage",
      },
      id: "1vu-1",
      name: "AMBUSH FROM THE DEEP",
      text: "AMBUSH FROM THE DEEP When you play this character, deal 3 damage to chosen opposing damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jetsamOpportunisticEelI18n,
};
