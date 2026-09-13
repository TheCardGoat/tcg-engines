import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { coldSnap } from "./cold-snap.ts";

export const coldSnapI18n = defineFamilyI18n(coldSnap, {
  en: {
    name: "Cold Snap",
    text: (_parameter, color) =>
      `Target hero may pay ${color === "red" ? "{r}{r}" : color === "yellow" ? "{r}{r}{r}" : "{r}"}. If they don't, freeze a card in their arsenal or an ally they control until the start of your next turn.\nIf Cold Snap is played from arsenal, draw a card.\nGo again`,
    typeText: "Ice Action",
  },
});

export const {
  red: coldSnapRedI18n,
  yellow: coldSnapYellowI18n,
  blue: coldSnapBlueI18n,
} = coldSnapI18n.cards;
