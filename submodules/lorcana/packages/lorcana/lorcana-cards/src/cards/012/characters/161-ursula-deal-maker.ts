import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaDealMakerI18n } from "./161-ursula-deal-maker.i18n";

export const ursulaDealMaker: CharacterCard = {
  id: "5iv",
  canonicalId: "ci_5iv",
  reprints: ["set12-161"],
  cardType: "character",
  name: "Ursula",
  version: "Deal Maker",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "012",
  cardNumber: 161,
  rarity: "legendary",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1a2311c3639d464d9eb638a08d535276",
  },
  text: [
    {
      title: "QUITE THE BARGAIN",
      description:
        "When you play this character and whenever she quests, another chosen character gets +1 {L} this turn.",
    },
    {
      title: "BY THE WAY",
      description:
        "At the end of your turn, if this character is exerted, put chosen character of yours into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "5iv-1",
      name: "QUITE THE BARGAIN",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          duration: "this-turn",
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
      text: "QUITE THE BARGAIN When you play this character and whenever she quests, another chosen character gets +1 {L} this turn.",
    },
    {
      id: "5iv-2",
      name: "QUITE THE BARGAIN",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          duration: "this-turn",
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
      text: "QUITE THE BARGAIN When you play this character and whenever she quests, another chosen character gets +1 {L} this turn.",
    },
    {
      id: "5iv-3",
      name: "BY THE WAY",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "exerted",
      },
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        exerted: true,
        facedown: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "BY THE WAY At the end of your turn, if this character is exerted, put chosen character of yours into your inkwell facedown and exerted.",
    },
  ],
  i18n: ursulaDealMakerI18n,
};
