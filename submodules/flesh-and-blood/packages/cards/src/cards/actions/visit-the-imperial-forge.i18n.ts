import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { visitTheImperialForge } from "./visit-the-imperial-forge.ts";

export const visitTheImperialForgeI18n = defineFamilyI18n(visitTheImperialForge, {
  en: {
    name: "Visit the Imperial Forge",
    text: ({ value1 }) => `Sword and dagger attacks have piercing ${value1} this turn.
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: visitTheImperialForgeRedI18n,
  yellow: visitTheImperialForgeYellowI18n,
  blue: visitTheImperialForgeBlueI18n,
} = visitTheImperialForgeI18n.cards;
