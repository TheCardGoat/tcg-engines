import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { knifeThroughButter } from "./knife-through-butter.ts";

export const knifeThroughButterI18n = defineFamilyI18n(knifeThroughButter, {
  en: {
    name: "Knife Through Butter",
    text: ({ value1 }) => `Your next dagger attack this turn gets +${value1}{p}.
Whenever you attack a marked hero this turn, the attack gets go again.
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: knifeThroughButterRedI18n,
  yellow: knifeThroughButterYellowI18n,
  blue: knifeThroughButterBlueI18n,
} = knifeThroughButterI18n.cards;
