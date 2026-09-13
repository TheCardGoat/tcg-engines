import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sliceUp } from "./slice-up.ts";

export const sliceUpI18n = defineFamilyI18n(sliceUp, {
  en: {
    name: "Slice Up",
    typeText: "Warrior Attack Reaction",
    text: 'Target weapon attack gets "When this hits a hero, you may remove a +1{p} counter from this weapon. If you do, they discard a card."',
  },
});

export const { red: sliceUpRedI18n } = sliceUpI18n.cards;
