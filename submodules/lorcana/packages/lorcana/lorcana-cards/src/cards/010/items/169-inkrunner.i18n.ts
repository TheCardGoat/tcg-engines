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
        title: "KONTROLLE VOR DEM FLUG",
        description: "Wenn du diesen Gegenstand ausspielst, ziehe 1 Karte.",
      },
      {
        title: "BEREIT ZUM ABFLUG, 1",
        description:
          "— Ein Charakter deiner Wahl erhält in diesem Zug Alarmiert. (Der Charakter kann herausfordern, als hätte er Wendig.)",
      },
    ],
  },
  fr: {
    name: "Encre-jet",
    text: [
      {
        title: "PRÉPARATIFS DE VOL",
        description:
          "Lorsque vous jouez cet objet, piochez une carte. PARÉ À VOLER, 1 — Choisissez un personnage qui gagne Agilité pour le reste de ce tour. (Il peut défier comme s'il avait Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Alainchiostro",
    text: [
      {
        title: "VERIFICA PRE-VOLO",
        description:
          "Quando giochi questo oggetto, pesca una carta. PRONTO A PARTIRE, 1 — Un personaggio a tua scelta ottiene Vigile per questo turno. (Può sfidare come se avesse Sfuggente.)",
      },
    ],
  },
};
