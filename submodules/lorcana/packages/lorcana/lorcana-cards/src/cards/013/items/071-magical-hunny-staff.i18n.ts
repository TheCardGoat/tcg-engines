import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicalHunnyStaffI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magical Hunny Staff",
    text: [
      {
        title: "GIFT OF THE HIVE",
        description:
          "Once during your turn, you may pay 1 {I} to give chosen character of yours the Hunny classification until the start of your next turn.",
      },
      {
        title: "SPELL OF SWIFTNESS",
        description:
          "{E}, 2 {I} — Chosen Hunny character of yours gains Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Magischer Honigstab",
    text: [
      {
        title: "Geschenk des Schwarms",
        description:
          "Einmal während deines Zuges darfst du 1 {I} bezahlen, um einen deiner Charaktere zu wählen. Jener erhält bis zu Beginn deines nächsten Zuges die Klassifizierung Honig.",
      },
      {
        title: "Zauber der Gewandtheit",
        description:
          "{E}, 2 {I} — Wähle einen deiner Honig-Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Bâton magique mellifique",
    text: [
      {
        title: "Don de la ruche",
        description:
          "Une fois durant votre tour, vous pouvez payer 1 {I} pour choisir l'un de vos personnages et lui donner la classification Miel jusqu'au début de votre prochain tour.",
      },
      {
        title: "Sort de célérité",
        description:
          "{E}, 2 {I} — Choisissez l'un de vos personnages Miel qui gagne <Insaisissable> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Bastone Magico del Miele",
    text: [
      {
        title: "Dono dell'Alveare",
        description:
          "Una volta durante il tuo turno, puoi pagare 1 {I} per dare a un tuo personaggio a tua scelta la classificazione Miele fino all'inizio del tuo prossimo turno.",
      },
      {
        title: "Incantesimo di Velocità",
        description:
          "{E}, 2 {I} — Un tuo personaggio Miele a tua scelta ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
  es: {
    name: "Bastón mágico de miel",
    text: [
      {
        title: "REGALO DE LA COLMENA",
        description:
          "Una vez durante tu turno, puedes pagar 1 {I} para otorgarle a tu personaje elegido la clasificación Hunny hasta el comienzo de tu siguiente turno.",
      },
      {
        title: "HECHIZO DE VELOCIDAD",
        description:
          "{E}, 2 {I}: tu personaje elegido Hunny gana Evasivo hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
