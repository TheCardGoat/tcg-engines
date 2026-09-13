import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scarTissue } from "./scar-tissue.ts";

export const scarTissueI18n = defineFamilyI18n(scarTissue, {
  en: {
    name: "Scar Tissue",
    typeText: "Assassin / Warrior Attack Reaction",
    text: (amount) =>
      `Target dagger attack gets +${amount}{p} and "When this hits a hero, mark them."`,
  },
});
export const {
  red: scarTissueRedI18n,
  yellow: scarTissueYellowI18n,
  blue: scarTissueBlueI18n,
} = scarTissueI18n.cards;
