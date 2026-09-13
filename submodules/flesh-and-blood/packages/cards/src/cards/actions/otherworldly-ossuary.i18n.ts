import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { otherworldlyOssuary } from "./otherworldly-ossuary.ts";

export const otherworldlyOssuaryI18n = defineFamilyI18n(otherworldlyOssuary, {
  en: {
    name: "Otherworldly Ossuary",
    typeText: "Shadow Necromancer Action",
    text: "Create a Corrupted Corpse in your banished zone.\nGo again",
  },
});

export const { blue: otherworldlyOssuaryBlueI18n } = otherworldlyOssuaryI18n.cards;
