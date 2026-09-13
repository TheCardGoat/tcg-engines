import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { violentGusto } from "./violent-gusto.ts";
export const violentGustoI18n = defineFamilyI18n(violentGusto, {
  en: {
    name: "Violent Gusto",
    typeText: "Generic Action - Attack",
    text: "When this attacks a hero, you may name an aura permanent they control and return it to its owner's hand.\nWhen this hits a hero, return all aura permanents they control with that name to their owner's hand.",
  },
});
export const { red: violentGustoRedI18n } = violentGustoI18n.cards;
