import type { CharacterCard } from "@tcg/lorcana-types";
import { littleJohnSirReginaldI18n } from "./176-little-john-sir-reginald.i18n";

export const littleJohnSirReginald: CharacterCard = {
  id: "2JD",
  canonicalId: "ci_2JD",
  reprints: ["set9-176"],
  cardType: "character",
  name: "Little John",
  version: "Sir Reginald",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "009",
  cardNumber: 176,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_4d7bf56fb70e41289a010677c1ebea27",
    tcgPlayer: 650109,
  },
  text: [
    {
      title: "WHAT A BEAUTIFUL BRAWL!",
      description: "When you play this character, choose one:",
    },
    {
      title: "* Chosen Hero character gains Resist +2 this turn.",
    },
    {
      title: "* Deal 2 damage to chosen Villain character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1mt-1",
      name: "WHAT A BEAUTIFUL BRAWL!",
      text: "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one: * Chosen Hero character gains Resist +2 this turn. * Deal 2 damage to chosen Villain character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "choice",
        optionLabels: [
          "Chosen Hero character gains Resist +2 this turn.",
          "Deal 2 damage to chosen Villain character.",
        ],
        options: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            duration: "this-turn",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
              filter: [{ type: "has-classification", classification: "Hero" }],
            },
          },
          {
            type: "deal-damage",
            amount: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [{ type: "has-classification", classification: "Villain" }],
            },
          },
        ],
      },
    },
  ],
  i18n: littleJohnSirReginaldI18n,
};
