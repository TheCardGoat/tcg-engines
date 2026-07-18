import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const judyHoppsResourcefulRabbitI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Judy Hopps",
    version: "Resourceful Rabbit",
    text: [
      {
        title: "Support",
      },
      {
        title: "NEED SOME HELP?",
        description: "At the end of your turn, you may ready another chosen character of yours.",
      },
    ],
  },
  de: {
    name: "Judy Hopps",
    version: "Einfallsreiche Häsin",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Brauchst du Hilfe?",
        description:
          "Am Ende deines Zuges darfst du einen deiner anderen Charaktere wählen und bereit machen.",
      },
    ],
  },
  fr: {
    name: "Judy Hopps",
    version: "Lapine pleine de ressources",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Un p'tit coup de patte?",
        description:
          "À la fin de votre tour, vous pouvez choisir et redresser un autre de vos personnages.",
      },
    ],
  },
  it: {
    name: "Judy Hopps",
    version: "Coniglietta Intraprendente",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Un Aiutino?",
        description:
          "Alla fine del tuo turno, puoi preparare un tuo altro personaggio a tua scelta.",
      },
    ],
  },
  es: {
    name: "Judy Hopps",
    version: "Conejo ingenioso",
    text: [
      {
        title: "Apoyo",
      },
      {
        title: "¿NECESITAS AYUDA?",
        description: "Al final de tu turno, puedes preparar otro personaje tuyo elegido.",
      },
    ],
  },
};
