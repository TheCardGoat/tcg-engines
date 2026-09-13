import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rakeTheEmbers } from "./rake-the-embers.ts";

export const rakeTheEmbersI18n = defineFamilyI18n(rakeTheEmbers, {
  en: {
    name: "Rake the Embers",
    text: ({ value1 }) =>
      `Create an Ash token, then transform up to ${value1} ash you control into ${value1 === 1 ? "an Aether Ashwing" : "Aether Ashwings"}.
Go again`,
    typeText: "Draconic Illusionist Action",
  },
});

export const {
  red: rakeTheEmbersRedI18n,
  yellow: rakeTheEmbersYellowI18n,
  blue: rakeTheEmbersBlueI18n,
} = rakeTheEmbersI18n.cards;
