import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mountingAnger } from "./mounting-anger.ts";

export const mountingAngerI18n = defineFamilyI18n(mountingAnger, {
  en: {
    name: "Mounting Anger",
    text: "When this hits, you may banish an attack action card from your hand with cost less than the number of Draconic chain links you control. If you do, it gains +1{p} and you may play it this turn.\nGo again",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: mountingAngerRedI18n,
  yellow: mountingAngerYellowI18n,
  blue: mountingAngerBlueI18n,
} = mountingAngerI18n.cards;
