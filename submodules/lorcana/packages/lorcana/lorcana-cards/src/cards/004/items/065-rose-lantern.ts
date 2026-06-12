import type { ItemCard } from "@tcg/lorcana-types";
import { roseLanternI18n } from "./065-rose-lantern.i18n";

export const roseLantern: ItemCard = {
  id: "wLO",
  canonicalId: "ci_bo3",
  reprints: ["set4-065", "set9-067"],
  cardType: "item",
  name: "Rose Lantern",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 65,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0294484e638d4f389732639af2b5d5e8",
    tcgPlayer: 647667,
  },
  text: [
    {
      title: "MYSTICAL PETALS",
      description:
        "{E}, 2 {I} — Move 1 damage counter from chosen character to chosen opposing character.",
    },
  ],
  abilities: [
    {
      id: "13b-1",
      name: "MYSTICAL PETALS",
      text: "{E}, 2 {I} — Move 1 damage counter from chosen character to chosen opposing character.",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "move-damage",
        amount: 1,
        from: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        to: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: roseLanternI18n,
};
