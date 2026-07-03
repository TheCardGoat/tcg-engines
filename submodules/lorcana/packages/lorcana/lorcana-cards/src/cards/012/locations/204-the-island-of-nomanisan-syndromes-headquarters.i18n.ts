import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theIslandOfNomanisanSyndromesHeadquartersI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Island of Nomanisan",
    version: "Syndrome's Headquarters",
    text: [
      {
        title: "RESEARCH",
        description: "& DEVELOPMENT Robot characters get +1 {S} and +1 {W} while here.",
      },
      {
        title: "CHEAP SHOT",
        description:
          "Once during your turn, whenever a character banishes another character in a challenge while here, you may deal 2 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Nomanisan Island",
    version: "Syndroms Hauptquartier",
    text: [
      {
        title: "Forschung und Entwicklung",
        description: "Roboter an diesem Ort erhalten +1 {S} und +1 {W}.",
      },
      {
        title: "Günstiger Schuss",
        description:
          "Einmal während deines Zuges, wenn einer deiner Charaktere an diesem Ort durch eine Herausforderung einen anderen Charakter verbannt, darfst du einem Charakter deiner Wahl 2 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Île de Nomanisan",
    version: "Quartier général de Syndrome",
    text: [
      {
        title: "Recherche et développement",
        description: "Vos personnages Robot sur ce lieu gagnent +1 {S} et +1 {W}.",
      },
      {
        title: "Coup bas",
        description:
          "Une fois durant votre tour, lorsqu'un personnage sur ce lieu en bannit un autre via un défi, vous pouvez choisir un personnage et lui infliger 2 dommages.",
      },
    ],
  },
  it: {
    name: "Isola Nonceunanima",
    version: "Quartier Generale di Sindrome",
    text: [
      {
        title: "Ricerca e Sviluppo",
        description:
          "I personaggi Robot ricevono +1 {S} e +1 {W} mentre si trovano in questo luogo.",
      },
      {
        title: "Colpo Basso",
        description:
          "Una volta durante il tuo turno, ogni volta che un personaggio esilia un altro personaggio in una sfida mentre si trova in questo luogo, puoi infliggere 2 danni a un personaggio a tua scelta.",
      },
    ],
  },
};
