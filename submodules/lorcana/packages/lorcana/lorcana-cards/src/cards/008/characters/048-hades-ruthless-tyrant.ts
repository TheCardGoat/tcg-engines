import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesRuthlessTyrantI18n } from "./048-hades-ruthless-tyrant.i18n";

export const hadesRuthlessTyrant: CharacterCard = {
  id: "C4b",
  canonicalId: "ci_C4b",
  reprints: ["set8-048"],
  cardType: "character",
  name: "Hades",
  version: "Ruthless Tyrant",
  inkType: ["amethyst", "ruby"],
  franchise: "Hercules",
  set: "008",
  cardNumber: 48,
  rarity: "common",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4c3204fa9fa14ff9a13a41cadc4259aa",
    tcgPlayer: 630060,
  },
  text: [
    {
      title: "SHORT ON PATIENCE",
      description:
        "When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: 2,
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
              type: "deal-damage",
            },
            {
              amount: 2,
              target: "CONTROLLER",
              type: "draw",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "keg-1",
      name: "SHORT ON PATIENCE",
      text: "SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: 2,
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
              type: "deal-damage",
            },
            {
              amount: 2,
              target: "CONTROLLER",
              type: "draw",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "keg-2",
      name: "SHORT ON PATIENCE",
      text: "SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: hadesRuthlessTyrantI18n,
};
