import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ritesOfEarthlore } from "./rites-of-earthlore.ts";

export const ritesOfEarthloreI18n = defineFamilyI18n(ritesOfEarthlore, {
  en: {
    name: "Rites of Earthlore",
    text: (amount) => `When this enters the arena, create a Seismic Surge token.
At the start of your turn, destroy this, then the next Guardian attack action card you play this turn gets +${amount}{p}.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: ritesOfEarthloreRedI18n,
  yellow: ritesOfEarthloreYellowI18n,
  blue: ritesOfEarthloreBlueI18n,
} = ritesOfEarthloreI18n.cards;
