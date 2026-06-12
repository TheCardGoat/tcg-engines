import type { CharacterCard } from "@tcg/lorcana-types";
import { bernardBrandnewAgentI18n } from "./002-bernard-brand-new-agent.i18n";

export const bernardBrandnewAgent: CharacterCard = {
  id: "oTM",
  canonicalId: "ci_oTM",
  reprints: ["set3-002"],
  cardType: "character",
  name: "Bernard",
  version: "Brand-New Agent",
  inkType: ["amber"],
  franchise: "Rescuers",
  set: "003",
  cardNumber: 2,
  rarity: "rare",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b00e336742ab4743850d9927c06c7c6e",
    tcgPlayer: 537218,
  },
  text: [
    {
      title: "I'LL CHECK IT OUT",
      description:
        "At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "oTM-1",
      name: "I'LL CHECK IT OUT",
      text: "I'LL CHECK IT OUT At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "ready",
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
        },
      },
    },
  ],
  i18n: bernardBrandnewAgentI18n,
};
