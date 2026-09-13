import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { condemnToSlaughter } from "./condemn-to-slaughter.ts";

export const condemnToSlaughterI18n = defineFamilyI18n(condemnToSlaughter, {
  en: {
    name: "Condemn to Slaughter",
    text: (amount) =>
      `Your next Runeblade attack this turn gets +${amount}{p}.\nYou may destroy an aura you control. If you do, each opponent destroys an aura permanent they control.\nGo again`,
    typeText: "Runeblade Action",
  },
});

export const {
  red: condemnToSlaughterRedI18n,
  yellow: condemnToSlaughterYellowI18n,
  blue: condemnToSlaughterBlueI18n,
} = condemnToSlaughterI18n.cards;
