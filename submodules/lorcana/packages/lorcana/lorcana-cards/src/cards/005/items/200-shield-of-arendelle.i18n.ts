import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shieldOfArendelleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shield of Arendelle",
    text: [
      {
        title: "DEFLECT",
        description:
          "Banish this item — Chosen character gains Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Schild von Arendelle",
    text: [
      {
        title: "Abwehren",
        description:
          "Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Bouclier d'Arendelle",
    text: [
      {
        title: "Parade",
        description:
          "Bannissez cet objet — Choisissez un personnage qui gagne <Résistance> +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Scudo di Arendelle",
    text: [
      {
        title: "Deviare",
        description:
          "Esilia questo oggetto — Un personaggio a tua scelta ottiene <Resistere> +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Escudo de Arendelle",
    text: [
      {
        title: "CAMBIAR",
        description:
          "Destierra este objeto: el personaje elegido obtiene Resistencia +1 hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
