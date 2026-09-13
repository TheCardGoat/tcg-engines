import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flexClaws } from "./flex-claws.ts";

export const flexClawsI18n = defineFamilyI18n(flexClaws, {
  en: {
    name: "Flex Claws",
    typeText: "Ninja Action - Attack",
    text: "When this hits, create a Crouching Tiger in your banished zone. You may play it this turn.\nGo again",
  },
});

export const {
  red: flexClawsRedI18n,
  yellow: flexClawsYellowI18n,
  blue: flexClawsBlueI18n,
} = flexClawsI18n.cards;
