import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { markOfUshering } from "./mark-of-ushering.ts";
export const markOfUsheringI18n = defineFamilyI18n(markOfUshering, {
  en: {
    name: "Mark of Ushering",
    typeText: "Shadow Necromancer Instant - Aura",
    text: 'Binds to an ally permanent you control.\nThe bound ally gets +1{p} and "Whenever this hits a hero or dies, create a Gate to i\'Arathael token."',
  },
});
export const { blue: markOfUsheringBlueI18n } = markOfUsheringI18n.cards;
