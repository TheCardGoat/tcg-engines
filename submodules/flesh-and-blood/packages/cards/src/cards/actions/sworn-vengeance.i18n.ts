import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { swornVengeance } from "./sworn-vengeance.ts";

export const swornVengeanceI18n = defineFamilyI18n(swornVengeance, {
  en: {
    name: "Sworn Vengeance",
    text: ({
      value1,
    }) => `Your next dagger attack this turn gets +${value1}{p} and "When this hits a hero, mark them."
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: swornVengeanceRedI18n,
  yellow: swornVengeanceYellowI18n,
  blue: swornVengeanceBlueI18n,
} = swornVengeanceI18n.cards;
