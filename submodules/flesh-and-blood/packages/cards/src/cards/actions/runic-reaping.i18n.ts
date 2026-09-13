import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { runicReaping } from "./runic-reaping.ts";

export const runicReapingI18n = defineFamilyI18n(runicReaping, {
  en: {
    name: "Runic Reaping",
    text: (count) =>
      `The next Runeblade attack action card you play this turn gains "When this hits, create ${count === 1 ? "a" : count} Runechant token${count === 1 ? "" : "s"}".\nIf an attack card was pitched to play Runic Reaping, the next Runeblade attack action card you play this turn gains +1{p}.\nGo again`,
    typeText: "Runeblade Action",
  },
});

export const {
  red: runicReapingRedI18n,
  yellow: runicReapingYellowI18n,
  blue: runicReapingBlueI18n,
} = runicReapingI18n.cards;
