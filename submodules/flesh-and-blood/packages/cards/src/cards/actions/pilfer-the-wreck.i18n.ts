import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pilferTheWreck } from "./pilfer-the-wreck.ts";

export const pilferTheWreckI18n = defineFamilyI18n(pilferTheWreck, {
  en: {
    name: "Pilfer the Wreck",
    text: "When this hits a hero, you may turn a card in their graveyard face-down. If it's yellow, create a Gold token.",
    typeText: "Pirate Action - Attack",
  },
});
export const {
  red: pilferTheWreckRedI18n,
  yellow: pilferTheWreckYellowI18n,
  blue: pilferTheWreckBlueI18n,
} = pilferTheWreckI18n.cards;
