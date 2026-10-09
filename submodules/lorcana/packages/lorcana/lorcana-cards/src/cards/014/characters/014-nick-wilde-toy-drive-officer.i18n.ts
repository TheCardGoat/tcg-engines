import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nickWildeToyDriveOfficerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nick Wilde",
    version: "Toy Drive Officer",
    text: [
      {
        title: "Support",
      },
      {
        title: "Community Outreach",
        description:
          "At the end of your turn, if you played 2 or more characters this turn, draw a card.",
      },
    ],
  },
  de: {
    name: "Nick Wilde",
    version: "Offizier für Spielzeugspenden",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Gemeinnützige Arbeit",
        description:
          "Am Ende deines Zuges, falls du in diesem Zug mindestens 2 Charaktere ausgespielt hast, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Nick Wilde",
    version: "Chargé de la collecte de jouets",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Mission sociale",
        description:
          "À la fin de votre tour, si vous avez joué 2 personnages ou plus ce tour-ci, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Nick Wilde",
    version: "Agente delle Macchinine",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Coinvolgere la Comunità",
        description:
          "Alla fine del tuo turno, se hai giocato 2 o più personaggi in questo turno, pesca una carta.",
      },
    ],
  },
  es: {
    name: "Nick Wilde",
    version: "Toy Drive Officer",
    text: [
      {
        title: "Support",
      },
      {
        title: "Community Outreach",
        description:
          "At the end of your turn, if you played 2 or more characters this turn, draw a card.",
      },
    ],
  },
};
