import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hamstringShot } from "./hamstring-shot.ts";

export const hamstringShotI18n = defineFamilyI18n(hamstringShot, {
  en: {
    name: "Hamstring Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Hamstring Shot hits a hero, their first attack during their next turn costs an additional {r}.",
  },
});

export const {
  red: hamstringShotRedI18n,
  yellow: hamstringShotYellowI18n,
  blue: hamstringShotBlueI18n,
} = hamstringShotI18n.cards;
