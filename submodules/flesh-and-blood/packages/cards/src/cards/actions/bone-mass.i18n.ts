import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boneMass } from "./bone-mass.ts";

export const boneMassI18n = defineFamilyI18n(boneMass, {
  en: {
    name: "Bone Mass",
    typeText: "Shadow Necromancer Action - Attack",
    text: "When this attacks, you may discard a zombie. If you do, your next attack this turn gets +1{p}.\nGo again",
  },
});

export const {
  red: boneMassRedI18n,
  yellow: boneMassYellowI18n,
  blue: boneMassBlueI18n,
} = boneMassI18n.cards;
