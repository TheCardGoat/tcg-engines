import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vengefulApparition } from "./vengeful-apparition.ts";

export const vengefulApparitionI18n = defineFamilyI18n(vengefulApparition, {
  en: {
    name: "Vengeful Apparition",
    typeText: "Illusionist Action - Aura",
    text: "When this leaves the arena, if you control no Illusionist auras, you may play your next aura with cost 2 or less this turn as though it were an instant. If you do, it enters the arena with a +1{p} counter.\nWard 1",
  },
});

export const {
  red: vengefulApparitionRedI18n,
  yellow: vengefulApparitionYellowI18n,
  blue: vengefulApparitionBlueI18n,
} = vengefulApparitionI18n.cards;
