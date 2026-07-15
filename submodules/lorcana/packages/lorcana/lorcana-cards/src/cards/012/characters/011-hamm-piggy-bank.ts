import type { CharacterCard } from "@tcg/lorcana-types";
import { hammPiggyBankI18n } from "./011-hamm-piggy-bank.i18n";

export const hammPiggyBank: CharacterCard = {
  id: "shb",
  canonicalId: "ci_shb",
  slug: "lorcana-ci_shb",
  printings: [
    {
      id: "set12-011",
      artId: "set12-011",
      setCode: "set12",
      collectorNumber: "11",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set12-011"],
  cardType: "character",
  name: "Hamm",
  version: "Piggy Bank",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 11,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_44d3ef4753ac4e039c91e30ecfe1dcaf",
    tcgPlayer: "692149",
  },
  text: [
    {
      title: "LOOSE CHANGE",
      description: "{E} — You pay 1 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "shb-1",
      name: "LOOSE CHANGE",
      text: "LOOSE CHANGE {E} — You pay 1 {I} less for the next character you play this turn.",
      type: "activated",
    },
  ],
  i18n: hammPiggyBankI18n,
};
