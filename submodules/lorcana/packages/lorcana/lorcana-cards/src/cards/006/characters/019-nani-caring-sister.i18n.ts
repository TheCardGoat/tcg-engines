import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const naniCaringSisterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nani",
    version: "Caring Sister",
    text: [
      {
        title: "Support",
      },
      {
        title: "I AM SO SORRY 2",
        description: "{I} — Chosen character gets -1 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Nani",
    version: "Fürsorgliche Schwester",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Es tut mir so Leid",
        description:
          "2 {I} — Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1 {S}.",
      },
    ],
  },
  fr: {
    name: "Nani",
    version: "Sœur bienveillante",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Je suis sincèrement désolée",
        description:
          "2 {I} — Choisissez un personnage qui subit -1 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Nani",
    version: "Sorella Premurosa",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Mi Dispiace Molto",
        description:
          "2 {I} — Un personaggio a tua scelta riceve -1 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
