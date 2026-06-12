import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseSweetheartPrincessI18n } from "./005-minnie-mouse-sweetheart-princess.i18n";

export const minnieMouseSweetheartPrincess: CharacterCard = {
  id: "GO3",
  canonicalId: "ci_f4y",
  reprints: ["set9-005"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Sweetheart Princess",
  inkType: ["amber"],
  set: "009",
  cardNumber: 5,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_77b92f4bb7d2460ea85b9d547cb8e72f",
    tcgPlayer: 651106,
  },
  text: [
    {
      title: "ROYAL FAVOR",
      description:
        "Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
    {
      title: "BYE BYE, NOW",
      description:
        "Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        keyword: "Support",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Mickey Mouse",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "ofq-1",
      name: "ROYAL FAVOR",
      text: "ROYAL FAVOR Your characters named Mickey Mouse gain Support.",
      type: "static",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "exerted",
              },
              {
                type: "strength-comparison",
                comparison: "greater-or-equal",
                value: 5,
              },
            ],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "ofq-2",
      name: "BYE BYE, NOW",
      text: "BYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: minnieMouseSweetheartPrincessI18n,
};
