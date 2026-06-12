import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaInfiltrationExpertI18n } from "./100-raya-infiltration-expert.i18n";

export const rayaInfiltrationExpert: CharacterCard = {
  id: "XZW",
  canonicalId: "ci_XZW",
  reprints: ["set8-100"],
  cardType: "character",
  name: "Raya",
  version: "Infiltration Expert",
  inkType: ["emerald"],
  franchise: "Raya and the Last Dragon",
  set: "008",
  cardNumber: 100,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0a97dde4f01045ccb29a9f61ac3c36d8",
    tcgPlayer: 631413,
  },
  text: [
    {
      title: "UNCONVENTIONAL TACTICS",
      description:
        "Whenever this character quests, you may pay 2 {I} to ready another chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 2,
          },
          effect: {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
            type: "ready",
          },
        },
        type: "optional",
      },
      id: "XZW-1",
      name: "UNCONVENTIONAL TACTICS",
      text: "UNCONVENTIONAL TACTICS Whenever this character quests, you may pay 2 {I} to ready another chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rayaInfiltrationExpertI18n,
};
