import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bitingBreeze } from "./biting-breeze.ts";

export const bitingBreezeI18n = defineFamilyI18n(bitingBreeze, {
  en: {
    name: "Biting Breeze",
    typeText: "Ninja Action - Attack",
    text: "When this hits, create a Crouching Tiger in your banished zone. You may play it this turn.\nGo again",
  },
});

export const {
  red: bitingBreezeRedI18n,
  yellow: bitingBreezeYellowI18n,
  blue: bitingBreezeBlueI18n,
} = bitingBreezeI18n.cards;
