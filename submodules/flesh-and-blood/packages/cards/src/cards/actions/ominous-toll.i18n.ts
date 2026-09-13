import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ominousToll } from "./ominous-toll.ts";
const textByColor = {
  red: "When this attacks, you may discard a zombie. If you do, create a Gate to i'Arathael token.\nGo again",
  yellow:
    "When this attacks, you may discard a zombie. If you do, create a Gate to i'Arathael token.\nGo again",
  blue: "When this attacks, you may discard a zombie. If you do, create a Gate to i'Arathael token.\nGo again",
} as const;
export const ominousTollI18n = defineFamilyI18n(ominousToll, {
  en: {
    name: "Ominous Toll",
    typeText: "Shadow Necromancer Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const {
  red: ominousTollRedI18n,
  yellow: ominousTollYellowI18n,
  blue: ominousTollBlueI18n,
} = ominousTollI18n.cards;
