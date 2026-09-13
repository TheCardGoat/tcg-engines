import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { acridStench } from "./acrid-stench.ts";

export const acridStenchI18n = defineFamilyI18n(acridStench, {
  en: {
    name: "Acrid Stench",
    typeText: "Shadow Necromancer Action - Attack",
    text: "When this attacks, you may discard a zombie. If you do, create a Corrupted Corpse in your banished zone.\nGo again",
  },
});

export const {
  red: acridStenchRedI18n,
  yellow: acridStenchYellowI18n,
  blue: acridStenchBlueI18n,
} = acridStenchI18n.cards;
