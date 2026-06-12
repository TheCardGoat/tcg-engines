import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyGroundbreakingChefI18n } from "./004-goofy-groundbreaking-chef.i18n";

export const goofyGroundbreakingChef: CharacterCard = {
  id: "cVT",
  canonicalId: "ci_fqx",
  reprints: ["set8-004"],
  cardType: "character",
  name: "Goofy",
  version: "Groundbreaking Chef",
  inkType: ["amber"],
  set: "008",
  cardNumber: 4,
  rarity: "legendary",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5271034abc194947b4c2b0e9c66b7f78",
    tcgPlayer: 632719,
  },
  text: [
    {
      title: "PLENTY TO GO AROUND",
      description:
        "At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "t21-1",
      name: "PLENTY TO GO AROUND",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 1 },
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
          type: "remove-damage",
          thenReady: true,
        },
        type: "optional",
      },
      text: "PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
    },
  ],
  i18n: goofyGroundbreakingChefI18n,
};
