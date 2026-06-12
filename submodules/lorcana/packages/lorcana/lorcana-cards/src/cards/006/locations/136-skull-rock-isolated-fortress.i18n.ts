import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const skullRockIsolatedFortressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Skull Rock",
    version: "Isolated Fortress",
    text: [
      {
        title: "FAMILIAR GROUND",
        description: "Characters get +1 {S} while here.",
      },
      {
        title: "SAFE HAVEN",
        description: "At the start of your turn, if you have a Pirate character here, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Schädelfelsen",
    version: "Abgelegene Festung",
    text: [
      {
        title: "VERTRAUTER BODEN",
        description: "Charaktere an diesem Ort erhalten +1.",
      },
      {
        title: "SICHERER HAFEN",
        description:
          "Zu Beginn deines Zuges, wenn du mindestens einen Piraten an diesem Ort hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Rocher du crâne",
    version: "Forteresse isolée",
    text: [
      {
        title: "EN TERRAIN CONNU",
        description: "Les personnages sur ce lieu gagnent +1.",
      },
      {
        title: "HAVRE DE PAIX",
        description:
          "Au début de votre tour, si vous avez un personnage Pirate sur ce lieu, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Roccia del Teschio",
    version: "Fortezza Isolata",
    text: [
      {
        title: "TERRENO FAMILIARE I",
        description: "personaggi ricevono +1 mentre si trovano in questo luogo.",
      },
      {
        title: "PORTO SICURO",
        description:
          "All'inizio del tuo turno, se hai un personaggio Pirata in questo luogo, ottieni 1 leggenda.",
      },
    ],
  },
};
