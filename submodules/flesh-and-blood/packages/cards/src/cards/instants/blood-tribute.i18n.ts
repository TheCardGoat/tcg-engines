import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bloodTribute } from "./blood-tribute.ts";

export const bloodTributeI18n = defineFamilyI18n(bloodTribute, {
  en: {
    name: "Blood Tribute",
    typeText: "Shadow Instant",
    text: (count) => `Opt ${count}, then banish the top card of your deck.`,
  },
});

export const {
  red: bloodTributeRedI18n,
  yellow: bloodTributeYellowI18n,
  blue: bloodTributeBlueI18n,
} = bloodTributeI18n.cards;
