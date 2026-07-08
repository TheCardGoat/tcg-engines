import type { CharacterCard } from "@tcg/lorcana-types";
import { todCleverFoxI18n } from "./081-tod-clever-fox.i18n";

export const todCleverFox: CharacterCard = {
  id: "zm4",
  canonicalId: "ci_zm4",
  slug: "lorcana-ci_zm4",
  printings: [
    {
      id: "set13-081",
      artId: "set13-081",
      setCode: "set13",
      collectorNumber: "81",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-081"],
  cardType: "character",
  name: "Tod",
  version: "Clever Fox",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "013",
  cardNumber: 81,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Problem Solving",
      description: "When you play this character, draw 2 cards, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      type: "triggered",
      name: "PROBLEM SOLVING",
      text: "PROBLEM SOLVING When you play this character, draw 2 cards, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
    },
  ],
  i18n: todCleverFoxI18n,
};
