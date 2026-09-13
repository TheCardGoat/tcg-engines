import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { toughOldWrench } from "./tough-old-wrench.ts";

export const toughOldWrenchI18n = defineFamilyI18n(toughOldWrench, {
  en: {
    name: "Tough Old Wrench",
    text: "Galvanize - When this defends, you may destroy an item you control. If you do, create a Golden Cog token.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: toughOldWrenchRedI18n,
  yellow: toughOldWrenchYellowI18n,
  blue: toughOldWrenchBlueI18n,
} = toughOldWrenchI18n.cards;
