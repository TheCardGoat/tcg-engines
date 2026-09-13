import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { powerOfMakeBelieve } from "./power-of-make-believe.ts";

export const powerOfMakeBelieveI18n = defineFamilyI18n(powerOfMakeBelieve, {
  en: {
    name: "Power of Make Believe",
    typeText: "Illusionist Action - Attack",
    text: "This gets +1{p} for each card with 6 or more {p} defending it.\nMirage",
  },
});

export const {
  red: powerOfMakeBelieveRedI18n,
  yellow: powerOfMakeBelieveYellowI18n,
  blue: powerOfMakeBelieveBlueI18n,
} = powerOfMakeBelieveI18n.cards;
