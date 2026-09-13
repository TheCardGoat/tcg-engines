import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { metex } from "./metex.ts";

export const metexI18n = defineFamilyI18n(metex, {
  en: {
    name: "MetEx",
    text: "Boost\nWhen this hits, you may put an item with cost 0 or 1 from your hand into the arena.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const { red: metexRedI18n, yellow: metexYellowI18n, blue: metexBlueI18n } = metexI18n.cards;
