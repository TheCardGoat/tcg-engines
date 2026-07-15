import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeJohnOpportunisticBriberI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince John",
    version: "Opportunistic Briber",
    text: [
      {
        title: "TAXES NEVER FAIL ME",
        description: "Whenever you play an item, this character gets +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Prinz John",
    version: "Gelegenheitsbetrüger",
    text: [
      {
        title: "Steuern lassen mich niemals im Stich",
        description:
          "Jedes Mal, wenn du einen Gegenstand ausspielst, erhält dieser Charakter in diesem Zug +2 {S}.",
      },
    ],
  },
  fr: {
    name: "Prince Jean",
    version: "Corrupteur opportuniste",
    text: [
      {
        title: "Je collecte toutes les taxes",
        description:
          "Chaque fois que vous jouez un objet, ce personnage gagne +2 {S} pour le reste du tour.",
      },
    ],
  },
  it: {
    name: "Principe Giovanni",
    version: "Corruttore Opportunista",
    text: [
      {
        title: "Le Tasse non Deludono Mai",
        description:
          "Ogni volta che giochi un oggetto, questo personaggio riceve +2 {S} per questo turno.",
      },
    ],
  },
};
