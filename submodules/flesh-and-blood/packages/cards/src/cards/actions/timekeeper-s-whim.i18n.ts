import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { timekeeperSWhim } from "./timekeeper-s-whim.ts";

export const timekeeperSWhimI18n = defineFamilyI18n(timekeeperSWhim, {
  en: {
    name: "Timekeeper's Whim",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nIf Timekeeper's Whim is played during an opponent's turn, put it on the bottom of its owner's deck.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: timekeeperSWhimRedI18n,
  yellow: timekeeperSWhimYellowI18n,
  blue: timekeeperSWhimBlueI18n,
} = timekeeperSWhimI18n.cards;
