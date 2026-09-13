import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spewShadow } from "./spew-shadow.ts";

export const spewShadowI18n = defineFamilyI18n(spewShadow, {
  en: {
    name: "Spew Shadow",
    text: ({
      value1,
    }) => `Choose an attack action card with cost ${value1} or less in your banished zone. You may play it this turn. If it attacks a Light hero, it gains +2{p}.
Go again`,
    typeText: "Shadow Action",
  },
});

export const {
  red: spewShadowRedI18n,
  yellow: spewShadowYellowI18n,
  blue: spewShadowBlueI18n,
} = spewShadowI18n.cards;
