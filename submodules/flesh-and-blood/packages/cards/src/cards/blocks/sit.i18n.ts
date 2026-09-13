import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sit } from "./sit.ts";

export const sitI18n = defineFamilyI18n(sit, {
  en: {
    name: "Sit!",
    text: "When this defends a Brute attack, this gets +3{d}.",
    typeText: "Guardian Block",
  },
});

export const { red: sitRedI18n } = sitI18n.cards;
