import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rapunzelReadyForAdventureI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rapunzel",
    version: "Ready for Adventure",
    text: [
      {
        title: "Support",
      },
      {
        title: "ACT OF KINDNESS",
        description:
          "Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.",
      },
    ],
  },
  de: {
    name: "Rapunzel",
    version: "Bereit für Abenteuer",
    text: [
      {
        title: "Unterstützen",
      },
      {
        title: "AKT DER FREUNDLICHKEIT",
        description:
          "Jedes Mal, wenn einer deiner Charaktere für Unterstützen ausgewählt wird, erhält er bis zu Beginn deines nächsten Zuges das nächste Mal, wenn er Schaden erhalten würde, stattdessen keinen Schaden.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Parée pour l'aventure",
    text: [
      {
        title: "Soutien",
      },
      {
        title: "GESTE ALTRUISTE",
        description:
          "Chaque fois que l'un de vos personnages est choisi par la capacité Soutien, jusqu'au début de votre prochain tour, la prochaine fois que ce personnage-là devrait subir des dommages, il n'en subit aucun à la place.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Pronta per l'Avventura",
    text: [
      {
        title: "Aiutante",
      },
      {
        title: "GESTO DI BONTÀ",
        description:
          "Ogni volta che uno dei tuoi personaggi viene scelto per Aiutante, fino all'inizio del tuo prossimo turno, la prossima volta che subirebbe danni invece non subisce danni.",
      },
    ],
  },
};
