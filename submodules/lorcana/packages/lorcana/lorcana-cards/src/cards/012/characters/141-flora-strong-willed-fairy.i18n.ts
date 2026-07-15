import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const floraStrongwilledFairyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flora",
    version: "Strong-Willed Fairy",
    text: [
      {
        title: "LUMINOUS SHELTER",
        description:
          "When you play this character, your other characters gain Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Flora",
    version: "Willensstarke Fee",
    text: [
      {
        title: "Leuchtender Unterschlupf",
        description:
          "Wenn du diesen Charakter ausspielst, erhalten deine anderen Charaktere bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Flora",
    version: "Fée à la volonté de fer",
    text: [
      {
        title: "Abri lumineux",
        description:
          "Lorsque vous jouez ce personnage, vos autres personnages gagnent <Résistance> +1 jusqu'au début de votre prochain tour. (Les dommages infligés à ces personnages sont réduits de 1.)",
      },
    ],
  },
  it: {
    name: "Flora",
    version: "Fata Tenace",
    text: [
      {
        title: "Riparo Luminoso",
        description:
          "Quando giochi questo personaggio, i tuoi altri personaggi ottengono <Resistere> +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
