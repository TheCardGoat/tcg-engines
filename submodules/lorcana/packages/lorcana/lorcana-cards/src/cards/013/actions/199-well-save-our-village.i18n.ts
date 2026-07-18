import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wellSaveOurVillageI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "We'll Save Our Village",
    text: "Your characters and locations gain Resist +1 until the start of your next turn.",
  },
  de: {
    name: "Schützt euer Städtchen",
    text: "Deine Charaktere und Orte erhalten bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
  },
  fr: {
    name: "Et brandissez vos oriflammes !",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Vos personnages et vos lieux gagnent <Résistance> +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Il Villaggio Rivivrà",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "I tuoi personaggi e luoghi ottengono <Resistere> +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Salvaremos nuestra aldea",
    text: "Tus personajes y ubicaciones obtienen Resistencia +1 hasta el comienzo de tu siguiente turno.",
  },
};
