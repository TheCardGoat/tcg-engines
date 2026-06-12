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
        title: "STEUERN LASSEN MICH NIEMALS IM STICH",
        description:
          "Jedes Mal, wenn du einen Gegenstand ausspielst, erhält dieser Charakter in diesem Zug +2.",
      },
    ],
  },
  fr: {
    name: "Prince Jean",
    version: "Corrupteur opportuniste",
    text: [
      {
        title: "JE COLLECTE TOUTES LES TAXES",
        description:
          "Chaque fois que vous jouez un objet, ce personnage gagne +2 pour le reste du tour.",
      },
    ],
  },
  it: {
    name: "Principe Giovanni",
    version: "Corruttore Opportunista",
    text: [
      {
        title: "LE TASSE NON DELUDONO MAI",
        description:
          "Ogni volta che giochi un oggetto, questo personaggio riceve +2 per questo turno.",
      },
    ],
  },
};
