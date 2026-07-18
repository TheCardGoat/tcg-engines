import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flounderCollectorsCompanionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flounder",
    version: "Collector’s Companion",
    text: [
      {
        title: "Support",
      },
      {
        title: "I'M NOT",
        description:
          "A GUPPY If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Fabius",
    version: "Begleiter der Sammlerin",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Ich bin keine Kaulquappe",
        description:
          "Wenn du einen Arielle-Charakter im Spiel hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Polochon",
    version: "Compagnon de la collectionneuse",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Je ne suis pas un poisson-lune",
        description:
          "Si vous avez un personnage Ariel en jeu, jouer ce personnage coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Flounder",
    version: "Compagno della Collezionista",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Non Sono un Pesce Rosso",
        description:
          "Se hai in gioco un personaggio chiamato Ariel, paga 1 {I} in meno per giocare questo personaggio.",
      },
    ],
  },
  es: {
    name: "Platija",
    version: "Compañero de coleccionista",
    text: [
      {
        title: "Apoyo",
      },
      {
        title: "NO LO SOY",
        description:
          "UN GUPPY Si tienes un personaje llamado Ariel en juego, pagas 1 {I} menos para interpretar a este personaje.",
      },
    ],
  },
};
