import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { futureSight } from "./future-sight.ts";

export const futureSightI18n = defineFamilyI18n(futureSight, {
  en: {
    name: "Future Sight",
    typeText: "Wizard Instant",
    text: ({ count }) =>
      count === 1 ? "Create a Sigil of Fate token." : `Create ${count} Sigil of Fate tokens.`,
  },
});

export const {
  red: futureSightRedI18n,
  yellow: futureSightYellowI18n,
  blue: futureSightBlueI18n,
} = futureSightI18n.cards;
