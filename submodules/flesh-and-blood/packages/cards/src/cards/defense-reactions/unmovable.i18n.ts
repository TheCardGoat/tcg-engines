import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { unmovable } from "./unmovable.ts";

export const unmovableI18n = defineFamilyI18n(unmovable, {
  en: {
    name: "Unmovable",
    text: (_, color) =>
      color === "red"
        ? "If this was played from arsenal, it gets +1{d}."
        : "If this is played from arsenal, it gains +1{d}.",
    typeText: "Generic Defense Reaction",
  },
});

export const {
  red: unmovableRedI18n,
  yellow: unmovableYellowI18n,
  blue: unmovableBlueI18n,
} = unmovableI18n.cards;
