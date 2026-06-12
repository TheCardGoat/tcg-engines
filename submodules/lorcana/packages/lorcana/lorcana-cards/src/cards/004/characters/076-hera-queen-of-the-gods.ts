import type { CharacterCard } from "@tcg/lorcana-types";
import { heraQueenOfTheGodsI18n } from "./076-hera-queen-of-the-gods.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const heraQueenOfTheGods: CharacterCard = {
  id: "vHX",
  canonicalId: "ci_vHX",
  reprints: ["set4-076"],
  cardType: "character",
  name: "Hera",
  version: "Queen of the Gods",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 76,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0ac3ee4c2bb043a280fa2e4f7f6505e7",
    tcgPlayer: 549668,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "PROTECTIVE GODDESS",
      description: "Your characters named Zeus gain Ward.",
    },
    {
      title: "YOU'RE A TRUE HERO",
      description: "Your characters named Hercules gain Evasive.",
    },
  ],
  classifications: ["Storyborn", "Queen", "Deity"],
  abilities: [
    ward,
    {
      effect: {
        keyword: "Ward",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Zeus",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "149-2",
      name: "PROTECTIVE GODDESS",
      text: "PROTECTIVE GODDESS Your characters named Zeus gain Ward.",
      type: "static",
    },
    {
      effect: {
        keyword: "Evasive",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Hercules",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "149-3",
      name: "YOU'RE A TRUE HERO",
      text: "YOU'RE A TRUE HERO Your characters named Hercules gain Evasive.",
      type: "static",
    },
  ],
  i18n: heraQueenOfTheGodsI18n,
};
