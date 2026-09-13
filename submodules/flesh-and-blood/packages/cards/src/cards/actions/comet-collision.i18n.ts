import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cometCollision } from "./comet-collision.ts";

export const cometCollisionI18n = defineFamilyI18n(cometCollision, {
  en: {
    name: "Comet Collision",
    typeText: "Lightning Wizard Action",
    text: (amount) =>
      `Deal ${amount} arcane damage to any target.\nStarfall - If an instant card has been put into your graveyard this turn, instead deal ${amount + 1} arcane damage.`,
  },
});

export const {
  red: cometCollisionRedI18n,
  yellow: cometCollisionYellowI18n,
  blue: cometCollisionBlueI18n,
} = cometCollisionI18n.cards;
