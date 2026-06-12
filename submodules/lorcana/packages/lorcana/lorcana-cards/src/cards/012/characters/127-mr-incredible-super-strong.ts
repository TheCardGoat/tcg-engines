import type { CharacterCard } from "@tcg/lorcana-types";
import { mrIncredibleSuperStrongI18n } from "./127-mr-incredible-super-strong.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const mrIncredibleSuperStrong: CharacterCard = {
  id: "qoz",
  canonicalId: "ci_qoz",
  reprints: ["set12-127"],
  cardType: "character",
  name: "Mr. Incredible",
  version: "Super Strong",
  inkType: ["ruby"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 127,
  rarity: "legendary",
  cost: 5,
  strength: 6,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_22adb1813838413ab42f071c073d4a04",
  },
  text: [
    {
      title: "Shift 3 {I}",
      description:
        "(You may pay 3 {I} to play this on top of one of your characters named Mr. Incredible.)",
    },
    {
      title: "ALWAYS UNITED",
      description: "This character gets +2 {S} for each other character you have in play.",
    },
    {
      title: "LET'S DO THIS!",
      description:
        "Whenever one of your Super characters challenges another character, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    shift("Mr. Incredible", 3),
    {
      id: "qoz-2",
      name: "ALWAYS UNITED",
      type: "static",
      text: "ALWAYS UNITED This character gets +2 {S} for each other character you have in play.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [],
          excludeSelf: true,
          multiplier: 2,
        },
        target: "SELF",
      },
    },
    {
      id: "qoz-3",
      name: "LET'S DO THIS!",
      type: "triggered",
      text: "LET'S DO THIS! Whenever one of your Super characters challenges another character, draw a card.",
      trigger: {
        event: "challenge",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Super",
        },
        defender: {
          filters: [{ type: "card-type", value: "character" }],
        },
        timing: "whenever",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: mrIncredibleSuperStrongI18n,
};
