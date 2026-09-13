import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bladeFlurry } from "./blade-flurry.ts";

export const bladeFlurryI18n = defineFamilyI18n(bladeFlurry, {
  en: {
    name: "Blade Flurry",
    typeText: "Warrior Attack Reaction",
    text: "Target weapon attack gets +2{p}.\nYour next weapon attack this turn gets +2{p}.",
  },
});

export const { red: bladeFlurryRedI18n } = bladeFlurryI18n.cards;
