import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { icebind } from "./icebind.ts";

export const icebindI18n = defineFamilyI18n(icebind, {
  en: {
    name: "Icebind",
    text: (_parameter, color) =>
      `Ice Fusion\nDeal ${color === "red" ? 1 : color === "yellow" ? 3 : 2} arcane damage to any target. If Icebind was fused and deals damage to a hero, freeze a card in their arsenal until the start of your next turn.`,
    typeText: "Elemental Wizard Action",
  },
});

export const {
  red: icebindRedI18n,
  yellow: icebindYellowI18n,
  blue: icebindBlueI18n,
} = icebindI18n.cards;
