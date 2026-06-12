import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dopeyDrawnToMusicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dopey",
    version: "Drawn to Music",
    text: [
      {
        title: "Tongue-Tied",
        description: "This character can't {E} to sing songs.",
      },
      {
        title: "Distant Melody",
        description:
          "Once during your turn, whenever you play a song, this character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Seppl",
    version: "Von der Musik angezogen",
    text: [
      {
        title: "Sprachlos",
        description: "Dieser Charakter kann nicht {E} werden, um Lieder zu singen.",
      },
      {
        title: "Ferne Melodie",
        description:
          "Einmal während deines Zuges, wenn du ein Lied ausspielst, erhält dieser Charakter in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Simplet",
    version: "Attiré par la musique",
    text: [
      {
        title: "Muet",
        description: "Ce personnage ne peut pas être {E} pour chanter des chansons.",
      },
      {
        title: "Mélodie lointaine",
        description:
          "Une fois durant votre tour, lorsque vous jouez une chanson, ce personnage gagne +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Cucciolo",
    version: "Attirato dalla Musica",
    text: [
      {
        title: "Silenzioso",
        description: "Questo personaggio non può {E} per cantare le canzoni.",
      },
      {
        title: "Melodia Distante",
        description:
          "Una volta durante il tuo turno, ogni volta che giochi una canzone, questo personaggio riceve +1 {L} per questo turno.",
      },
    ],
  },
};
