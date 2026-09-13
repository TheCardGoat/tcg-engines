import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { markOfNeverest } from "./mark-of-neverest.ts";
export const markOfNeverestI18n = defineFamilyI18n(markOfNeverest, {
  en: {
    name: "Mark of Neverest",
    typeText: "Shadow Necromancer Instant - Aura",
    text: 'Binds to an ally permanent you control.\nThe bound ally gets +1{p} and "Whenever this hits a hero or dies, you may turn a card in your banished zone face-down. If you do, create a Corrupted Corpse in your banished zone."',
  },
});
export const { blue: markOfNeverestBlueI18n } = markOfNeverestI18n.cards;
