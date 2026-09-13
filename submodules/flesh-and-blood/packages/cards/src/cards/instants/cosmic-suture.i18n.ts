import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cosmicSuture } from "./cosmic-suture.ts";

export const cosmicSutureI18n = defineFamilyI18n(cosmicSuture, {
  en: {
    name: "Cosmic Suture",
    text: (_parameter, color) =>
      `Prevent the next ${color === "red" ? 4 : color === "yellow" ? 3 : 2} damage that would be dealt to you this turn.\nStarfall - If an instant card has been put into your graveyard this turn, deal 1 arcane damage to target hero.`,
    typeText: "Lightning Wizard Instant",
  },
});

export const {
  red: cosmicSutureRedI18n,
  yellow: cosmicSutureYellowI18n,
  blue: cosmicSutureBlueI18n,
} = cosmicSutureI18n.cards;
