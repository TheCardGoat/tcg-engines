import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { razorReflex } from "./razor-reflex.ts";

export const razorReflexI18n = defineFamilyI18n(razorReflex, {
  en: {
    name: "Razor Reflex",
    typeText: "Generic Attack Reaction",
    text: (amount) =>
      `Choose 1;\n- Target dagger or sword weapon attack gets +${amount}{p}.\n- Target attack action card with cost 1 or less gets +${amount}{p} and "When this hits, it gets go again."`,
  },
});

export const {
  red: razorReflexRedI18n,
  yellow: razorReflexYellowI18n,
  blue: razorReflexBlueI18n,
} = razorReflexI18n.cards;
