import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tianaNaturalTalentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tiana",
    version: "Natural Talent",
    text: [
      {
        title: "Singer 6",
      },
      {
        title: "CAPTIVATING MELODY",
        description:
          "Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Tiana",
    version: "Naturtalent",
    text: [
      {
        title: "<Singen> 6 (Die Kosten dieses Charakters gelten als 6 für das Singen von Liedern.)",
      },
      {
        title: "Mitreißende Melodie",
        description:
          "Jedes Mal, wenn du ein Lied ausspielst, gib allen gegnerischen Charakteren bis zu Beginn deines nächsten Zuges -1 {S}.",
      },
    ],
  },
  fr: {
    name: "Tiana",
    version: "Talent naturel",
    text: [
      {
        title:
          "<Mélomane> 6 (Ce personnage est considéré comme ayant un coût de 6 pour chanter des chansons.)",
      },
      {
        title: "Mélodie captivante",
        description:
          "Chaque fois que vous jouez une chanson, chaque personnage adverse subit -1 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Tiana",
    version: "Talento Naturale",
    text: [
      {
        title: "<Melodioso> 6",
      },
      {
        title: "Melodia Affascinante",
        description:
          "Ogni volta che giochi una canzone, ogni personaggio avversario riceve -1 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Tiana",
    version: "Talento Natural",
    text: [
      {
        title: "Cantante 6",
      },
      {
        title: "MELODÍA CAUTIVADORA",
        description:
          "Cada vez que reproduces una canción, cada personaje contrario obtiene -1 {S} hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
