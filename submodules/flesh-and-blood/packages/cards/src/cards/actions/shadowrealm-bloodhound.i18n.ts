import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shadowrealmBloodhound } from "./shadowrealm-bloodhound.ts";

export const shadowrealmBloodhoundI18n = defineFamilyI18n(shadowrealmBloodhound, {
  en: {
    name: "Shadowrealm Bloodhound",
    typeText: "Shadow Action - Attack",
    text: "When this attacks, you may banish a card from your hand. If it's Shadow, this gets go again.\nBlood Debt",
  },
});

export const {
  red: shadowrealmBloodhoundRedI18n,
  yellow: shadowrealmBloodhoundYellowI18n,
  blue: shadowrealmBloodhoundBlueI18n,
} = shadowrealmBloodhoundI18n.cards;
