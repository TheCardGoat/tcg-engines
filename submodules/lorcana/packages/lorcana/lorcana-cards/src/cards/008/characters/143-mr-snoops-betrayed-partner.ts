import type { CharacterCard } from "@tcg/lorcana-types";
import { mrSnoopsBetrayedPartnerI18n } from "./143-mr-snoops-betrayed-partner.i18n";

export const mrSnoopsBetrayedPartner: CharacterCard = {
  id: "2lr",
  canonicalId: "ci_2lr",
  reprints: ["set8-143"],
  cardType: "character",
  name: "Mr. Snoops",
  version: "Betrayed Partner",
  inkType: ["ruby"],
  franchise: "Rescuers",
  set: "008",
  cardNumber: 143,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8010db6668ab482899edbda27487eaae",
    tcgPlayer: 631768,
  },
  text: [
    {
      title: "DOUBLE-CROSSING CROOK!",
      description: "During your turn, when this character is banished, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1iu-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "DOUBLE-CROSSING CROOK!",
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "when",
      },
      type: "triggered",
      text: "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.",
    },
  ],
  i18n: mrSnoopsBetrayedPartnerI18n,
};
