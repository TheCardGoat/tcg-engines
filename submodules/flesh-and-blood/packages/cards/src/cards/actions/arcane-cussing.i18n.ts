import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arcaneCussing } from "./arcane-cussing.ts";

export const arcaneCussingI18n = defineFamilyI18n(arcaneCussing, {
  en: {
    name: "Arcane Cussing",
    text: (count) =>
      `Go again\nWhen you deal or are dealt damage, destroy this.\nWhen this leaves the arena during your turn, create ${count === 1 ? "a" : count} Runechant token${count === 1 ? "" : "s"}.`,
    typeText: "Runeblade Action - Aura",
  },
});

export const {
  red: arcaneCussingRedI18n,
  yellow: arcaneCussingYellowI18n,
  blue: arcaneCussingBlueI18n,
} = arcaneCussingI18n.cards;
