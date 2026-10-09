import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const piratePlaneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pirate Plane",
    text: [
      {
        title: "Dodge This!",
        description: "When you play this item, you may deal 1 damage to chosen character.",
      },
      {
        title: "Barrel Roll",
        description:
          "{E}, 1 {I} — Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Piratenflugzeug",
    text: [
      {
        title: "Weiche dem mal aus!",
        description:
          "Wenn du diesen Gegenstand ausspielst, darfst du einem Charakter deiner Wahl 1 Schaden zufügen.",
      },
      {
        title: "Fassrolle",
        description:
          "{E}, 1 {I} — Ein Charakter deiner Wahl erhält in diesem Zug <Alarmiert>. (Der Charakter kann herausfordern, als hätte er Wendig.)",
      },
    ],
  },
  fr: {
    name: "Avion pirate",
    text: [
      {
        title: "Esquive celle-là!",
        description:
          "Lorsque vous jouez cet objet, vous pouvez choisir un personnage et lui infliger 1 dommage.",
      },
      {
        title: "Faire un tonneau",
        description:
          "{E}, 1 {I} — Choisissez un personnage qui gagne <Agilité> pour le reste de ce tour. (Il peut défier comme s'il avait Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Aereo Pirata",
    text: [
      {
        title: "Schiva Questo!",
        description:
          "Quando giochi questo oggetto, puoi infliggere 1 danno a un personaggio a tua scelta.",
      },
      {
        title: "Avvitamento",
        description:
          "{E}, 1 {I} — Un personaggio a tua scelta ottiene <Vigile> per questo turno. (Può sfidare come se avesse Sfuggente.)",
      },
    ],
  },
  es: {
    name: "Pirate Plane",
    text: [
      {
        title: "Dodge This!",
        description: "When you play this item, you may deal 1 damage to chosen character.",
      },
      {
        title: "Barrel Roll",
        description:
          "{E}, 1 {I} — Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
      },
    ],
  },
};
