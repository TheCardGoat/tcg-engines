import type { CharacterCard } from "@tcg/lorcana-types";
import { namaariSinglemindedRivalI18n } from "./198-namaari-single-minded-rival.i18n";

export const namaariSinglemindedRival: CharacterCard = {
  id: "Gsh",
  canonicalId: "ci_Gsh",
  reprints: ["set8-198"],
  cardType: "character",
  name: "Namaari",
  version: "Single-Minded Rival",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "008",
  cardNumber: 198,
  rarity: "legendary",
  cost: 5,
  strength: 0,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_444715c10be04c9f875a24424adb9fb4",
    tcgPlayer: 631849,
  },
  text: [
    {
      title: "STRATEGIC EDGE",
      description:
        "When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
    },
    {
      title: "EXTREME FOCUS",
      description: "This character gets +1 {S} for each card in your discard.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
        type: "optional",
      },
      id: "xx2-1",
      name: "STRATEGIC EDGE",
      text: "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
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
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
        type: "optional",
      },
      id: "xx2-3",
      name: "STRATEGIC EDGE",
      text: "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
    {
      effect: {
        modifier: {
          type: "cards-in-discard",
          controller: "you",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "xx2-2",
      name: "EXTREME FOCUS",
      text: "EXTREME FOCUS This character gets +1 {S} for each card in your discard.",
      type: "static",
    },
  ],
  i18n: namaariSinglemindedRivalI18n,
};
