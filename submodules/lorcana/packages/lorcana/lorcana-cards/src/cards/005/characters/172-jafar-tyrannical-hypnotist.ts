import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarTyrannicalHypnotistI18n } from "./172-jafar-tyrannical-hypnotist.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const jafarTyrannicalHypnotist: CharacterCard = {
  id: "4QY",
  canonicalId: "ci_4QY",
  reprints: ["set5-172"],
  cardType: "character",
  name: "Jafar",
  version: "Tyrannical Hypnotist",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "005",
  cardNumber: 172,
  rarity: "legendary",
  cost: 6,
  strength: 0,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1ba7f7638b4a47d29957c8eef13099b8",
    tcgPlayer: 561328,
  },
  text: [
    {
      title: "Challenger +7",
    },
    {
      title: "INTIMIDATING GAZE",
      description: "Opposing characters with cost 4 or less can't challenge.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    challenger(7),
    {
      effect: {
        restriction: "cant-challenge",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          cardTypes: ["character"],
          zones: ["play"],
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 4,
            },
          ],
        },
        type: "restriction",
      },
      id: "xg5-2",
      name: "INTIMIDATING GAZE",
      text: "INTIMIDATING GAZE Opposing characters with cost 4 or less can't challenge.",
      type: "static",
    },
  ],
  i18n: jafarTyrannicalHypnotistI18n,
};
