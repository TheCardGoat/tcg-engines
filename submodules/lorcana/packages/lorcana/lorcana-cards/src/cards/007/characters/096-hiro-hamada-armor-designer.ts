import type { CharacterCard } from "@tcg/lorcana-types";
import { hiroHamadaArmorDesignerI18n } from "./096-hiro-hamada-armor-designer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const hiroHamadaArmorDesigner: CharacterCard = {
  id: "rKO",
  canonicalId: "ci_TaU",
  reprints: ["set7-096"],
  cardType: "character",
  name: "Hiro Hamada",
  version: "Armor Designer",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  cardNumber: 96,
  rarity: "common",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_434537e486234e2095f03c19628e07d4",
    tcgPlayer: 619742,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "YOU CAN BE WAY MORE",
      description:
        "Your Floodborn characters that have a card under them gain Evasive and Ward. (Only characters with Evasive can challenge them. Opponents can't choose them except to challenge.)",
    },
  ],
  classifications: ["Floodborn", "Hero", "Inventor"],
  abilities: [
    shift(5),
    {
      effect: {
        keyword: "Evasive",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filters: [
            { type: "has-classification", classification: "Floodborn" },
            { type: "cards-under", comparison: "greater-or-equal", value: 1 },
          ],
        },
        type: "gain-keyword",
      },
      id: "zri-2",
      name: "YOU CAN BE WAY MORE",
      text: "YOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward.",
      type: "static",
    },
    {
      effect: {
        keyword: "Ward",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filters: [
            { type: "has-classification", classification: "Floodborn" },
            { type: "cards-under", comparison: "greater-or-equal", value: 1 },
          ],
        },
        type: "gain-keyword",
      },
      id: "zri-3",
      name: "YOU CAN BE WAY MORE",
      text: "YOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward.",
      type: "static",
    },
  ],
  i18n: hiroHamadaArmorDesignerI18n,
};
