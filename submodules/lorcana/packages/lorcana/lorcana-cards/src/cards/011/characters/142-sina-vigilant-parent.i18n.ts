import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sinaVigilantParentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sina",
    version: "Vigilant Parent",
    text: [
      {
        title: "Alert",
        description: "(This character can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Sina",
    version: "Wachsames Elternteil",
    text: [
      {
        title: "Alarmiert",
        description: "(Dieser Charakter kann herausfordern, als hätte er Wendig.)",
      },
    ],
  },
  fr: {
    name: "Sina",
    version: "Parent vigilant",
    text: "Agilité (Ce personnage peut défier comme s'il était Insaisissable.)",
  },
  it: {
    name: "Sina",
    version: "Genitrice Attenta",
    text: [
      {
        title: "Vigile",
        description: "(Questo personaggio può sfidare come se avesse Sfuggente.)",
      },
    ],
  },
};
