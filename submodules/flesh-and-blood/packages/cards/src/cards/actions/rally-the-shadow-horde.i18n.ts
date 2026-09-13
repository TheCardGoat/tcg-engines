import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rallyTheShadowHorde } from "./rally-the-shadow-horde.ts";

export const rallyTheShadowHordeI18n = defineFamilyI18n(rallyTheShadowHorde, {
  en: {
    name: "Rally the Shadow Horde",
    typeText: "Shadow Action - Attack",
    text: "Once per Turn Instant - Banish a card from your hand: This gets +2{d}. Activate this only while this card is defending.\nBlood Debt",
  },
});

export const {
  red: rallyTheShadowHordeRedI18n,
  yellow: rallyTheShadowHordeYellowI18n,
  blue: rallyTheShadowHordeBlueI18n,
} = rallyTheShadowHordeI18n.cards;
