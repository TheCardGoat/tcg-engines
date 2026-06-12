import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimTinyAdversaryI18n } from "./037-madam-mim-tiny-adversary.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const madamMimTinyAdversary: CharacterCard = {
  id: "SKE",
  canonicalId: "ci_SKE",
  reprints: ["set6-037"],
  cardType: "character",
  name: "Madam Mim",
  version: "Tiny Adversary",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "006",
  cardNumber: 37,
  rarity: "rare",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cb73a29ef0e94fdb80188902527c5d86",
    tcgPlayer: 593023,
  },
  text: [
    {
      title: "Challenger +1",
    },
    {
      title: "ZIM ZABBERIM ZIM",
      description: "Your other characters gain Challenger +1.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    challenger(1),
    {
      effect: {
        keyword: "Challenger",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "jgv-2",
      name: "ZIM ZABBERIM ZIM",
      text: "ZIM ZABBERIM ZIM Your other characters gain Challenger +1.",
      type: "static",
    },
  ],
  i18n: madamMimTinyAdversaryI18n,
};
