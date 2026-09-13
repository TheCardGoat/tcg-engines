import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { warriorSValor } from "./warrior-s-valor.ts";

export const warriorSValorI18n = defineFamilyI18n(warriorSValor, {
  en: {
    name: "Warrior's Valor",
    text: ({
      value1,
    }) => `Your next weapon attack this turn gets +${value1}{p} and "When this hits, it gets go again."
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: warriorSValorRedI18n,
  yellow: warriorSValorYellowI18n,
  blue: warriorSValorBlueI18n,
} = warriorSValorI18n.cards;
