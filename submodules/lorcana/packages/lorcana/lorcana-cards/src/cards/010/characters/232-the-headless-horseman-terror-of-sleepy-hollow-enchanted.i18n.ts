import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theHeadlessHorsemanTerrorOfSleepyHollowEnchantedI18n: Record<
  Languages,
  I18nProperties
> = {
  en: {
    name: "The Headless Horseman",
    version: "Terror of Sleepy Hollow",
    text: [
      {
        title: "LEAVES NO TRACE",
        description:
          "When you play this character, banish chosen opposing character with 2 {S} or less.",
      },
      {
        title: "GATHERING STRENGTH",
        description:
          "During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Der kopflose Reiter",
    version: "Schrecken von Sleepy Hollow",
    text: [
      {
        title: "HINTERLÄSST KEINE SPUREN",
        description:
          "Wenn du diesen Charakter ausspielst, verbanne einen gegnerischen Charakter deiner Wahl mit 2 oder weniger.",
      },
      {
        title: "KRÄFTE SAMMELN",
        description:
          "Jedes Mal während deines Zuges, wenn ein gegnerischer Charakter verbannt wird, erhalten deine Charaktere in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Le Cavalier sans tête",
    version: "Terreur de Sleepy Hollow",
    text: [
      {
        title: "SANS LAISSER DE TRACE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse ayant 2 ou moins et bannissez-le.",
      },
      {
        title: "COLLECTANT LA FORCE",
        description:
          "Durant votre tour, chaque fois qu'un personnage adverse est banni, chacun de vos personnages gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Il Cavaliere Senza Testa",
    version: "Terrore della Valle Addormentata",
    text: [
      {
        title: "NON LASCIA TRACCE",
        description:
          "Quando giochi questo personaggio, esilia un personaggio avversario a tua scelta con 2 o inferiore.",
      },
      {
        title: "ACCUMULARE FORZA",
        description:
          "Durante il tuo turno, ogni volta che un personaggio avversario viene esiliato, ogni tuo personaggio riceve +1 per questo turno.",
      },
    ],
  },
};
