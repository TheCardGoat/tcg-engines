import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { markOfPathstone } from "./mark-of-pathstone.ts";
export const markOfPathstoneI18n = defineFamilyI18n(markOfPathstone, {
  en: {
    name: "Mark of Pathstone",
    typeText: "Shadow Necromancer Instant - Aura",
    text: 'Binds to an ally permanent you control.\nThe bound ally gets +1{p} and "Whenever this hits a hero or dies, gain 1{h}."',
  },
});
export const { blue: markOfPathstoneBlueI18n } = markOfPathstoneI18n.cards;
