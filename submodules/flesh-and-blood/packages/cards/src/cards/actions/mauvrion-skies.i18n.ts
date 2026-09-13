import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mauvrionSkies } from "./mauvrion-skies.ts";

export const mauvrionSkiesI18n = defineFamilyI18n(mauvrionSkies, {
  en: {
    name: "Mauvrion Skies",
    text: (count, color) =>
      color === "blue"
        ? `The next Runeblade attack action card you play this turn gets go again and "When this hits, create ${count === 1 ? "a" : count} Runechant token${count === 1 ? "" : "s"}."\nGo again`
        : `The next runeblade attack action card you play this turn gains go again and "If this hits, create ${count === 1 ? "a" : count} Runechant token${count === 1 ? "" : "s"}."\nGo again`,
    typeText: "Runeblade Action",
  },
});

export const {
  red: mauvrionSkiesRedI18n,
  yellow: mauvrionSkiesYellowI18n,
  blue: mauvrionSkiesBlueI18n,
} = mauvrionSkiesI18n.cards;
