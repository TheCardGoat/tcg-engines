import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const inkrunnerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Inkrunner",
    text: [
      {
        title: "PREFLIGHT CHECK",
        description: "When you play this item, draw a card.",
      },
      {
        title: "READY TO RIDE",
        description:
          "{E}, 1 {I} — Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Tintenflügel",
    text: [
      {
        title: "Kontrolle vor dem Flug",
        description: "Wenn du diesen Gegenstand ausspielst, ziehe 1 Karte.",
      },
      {
        title: "Bereit zum Abflug",
        description:
          "{E}, 1 {I} — Ein Charakter deiner Wahl erhält in diesem Zug <Alarmiert>. (Der Charakter kann herausfordern, als hätte er Wendig.)",
      },
    ],
  },
  fr: {
    name: "Encre-jet",
    text: [
      {
        title: "Préparatifs de vol",
        description: "Lorsque vous jouez cet objet, piochez une carte.",
      },
      {
        title: "Paré à voler",
        description:
          "{E}, 1 {I} — Choisissez un personnage qui gagne <Agilité> pour le reste de ce tour. (Il peut défier comme s'il avait Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Alainchiostro",
    text: [
      {
        title: "Verifica Pre-Volo",
        description: "Quando giochi questo oggetto, pesca una carta.",
      },
      {
        title: "Pronto a Partire",
        description:
          "{E}, 1 {I} — Un personaggio a tua scelta ottiene <Vigile> per questo turno. (Può sfidare come se avesse Sfuggente.)",
      },
    ],
  },
};
