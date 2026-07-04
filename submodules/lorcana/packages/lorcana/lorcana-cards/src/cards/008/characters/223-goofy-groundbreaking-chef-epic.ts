import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyGroundbreakingChefEpicI18n } from "./223-goofy-groundbreaking-chef-epic.i18n";

export const goofyGroundbreakingChefEpic: CharacterCard = {
  id: "UHm",
  canonicalId: "ci_fqx",
  slug: "lorcana-ci_fqx",
  printings: [
    {
      id: "set8-223-epic",
      artId: "ci_fqx-epic",
      setCode: "set8",
      collectorNumber: "223",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set8-004"],
  cardType: "character",
  name: "Goofy",
  version: "Groundbreaking Chef",
  inkType: ["amber"],
  set: "008",
  cardNumber: 223,
  rarity: "legendary",
  specialRarity: "epic",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_964fd75940c7465caafa4cec1e84ed4f",
    tcgPlayer: "634263",
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
          amount: {
            type: "up-to",
            value: 1,
          },
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
  i18n: goofyGroundbreakingChefEpicI18n,
};
