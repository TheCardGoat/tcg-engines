import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dataLink } from "./data-link.ts";

export const dataLinkI18n = defineFamilyI18n(dataLink, {
  en: {
    name: "Data Link",
    text: "Boost\nWhen this hits, opt 1.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: dataLinkRedI18n,
  yellow: dataLinkYellowI18n,
  blue: dataLinkBlueI18n,
} = dataLinkI18n.cards;
