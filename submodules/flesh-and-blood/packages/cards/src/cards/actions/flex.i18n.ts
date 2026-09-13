import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flex } from "./flex.ts";

export const flexI18n = defineFamilyI18n(flex, {
  en: {
    name: "Flex",
    typeText: "Generic Action - Attack",
    text: "When you attack or defend with Flex, you may pay {r}{r}. If you do, it gains +2{p}.",
  },
});

export const { red: flexRedI18n, yellow: flexYellowI18n, blue: flexBlueI18n } = flexI18n.cards;
