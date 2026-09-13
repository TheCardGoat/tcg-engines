import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { memorialGround } from "./memorial-ground.ts";

export const memorialGroundI18n = defineFamilyI18n(memorialGround, {
  en: {
    name: "Memorial Ground",
    typeText: "Generic Instant",
    text: ({ maxCost }) =>
      `Put target attack action card with cost ${maxCost} or less from your graveyard on top of your deck.`,
  },
});

export const {
  red: memorialGroundRedI18n,
  yellow: memorialGroundYellowI18n,
  blue: memorialGroundBlueI18n,
} = memorialGroundI18n.cards;
