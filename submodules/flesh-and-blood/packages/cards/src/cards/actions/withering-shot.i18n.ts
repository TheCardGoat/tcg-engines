import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { witheringShot } from "./withering-shot.ts";

export const witheringShotI18n = defineFamilyI18n(witheringShot, {
  en: {
    name: "Withering Shot",
    text: ({ textValue1 }) => `If Withering Shot has an aim counter, it has +${textValue1}{p}.
When this hits a hero, create a Frailty token under their control.`,
    typeText: "Ranger Action - Arrow Attack",
  },
});

export const {
  red: witheringShotRedI18n,
  yellow: witheringShotYellowI18n,
  blue: witheringShotBlueI18n,
} = witheringShotI18n.cards;
