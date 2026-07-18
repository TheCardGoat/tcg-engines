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
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Akt der Freundlichkeit",
        description:
          "Jedes Mal, wenn einer deiner Charaktere für <Unterstützen> ausgewählt wird, erhält er bis zu Beginn deines nächsten Zuges das nächste Mal, wenn er Schaden erhalten würde, stattdessen keinen Schaden.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Parée pour l'aventure",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Geste altruiste",
        description:
          "Chaque fois que l'un de vos personnages est choisi par la capacité <Soutien>, jusqu'au début de votre prochain tour, la prochaine fois que ce personnage-là devrait subir des dommages, il n'en subit aucun à la place.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Pronta per l'Avventura",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Gesto di Bontà",
        description:
          "Ogni volta che uno dei tuoi personaggi viene scelto per <Aiutante>, fino all'inizio del tuo prossimo turno, la prossima volta che subirebbe danni invece non subisce danni.",
      },
    ],
  },
  es: {
    name: "Rapunzel",
    version: "Listo para la aventura",
    text: [
      {
        title: "Apoyo",
      },
      {
        title: "ACTO DE BONDAD",
        description:
          "Siempre que uno de tus personajes sea elegido para apoyo, hasta el comienzo de tu siguiente turno, la próxima vez que reciba daño, no recibirá daño.",
      },
    ],
  },
};
