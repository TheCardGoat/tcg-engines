import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const eeyoreInTheWayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Eeyore",
    version: "In the Way",
    text: [
      {
        title: "THANKS FOR NOTICIN' ME",
        description:
          "For each exerted character in play, you pay 1 {I} less to play this character.",
      },
      {
        title: "SORRY ABOUT THAT",
        description:
          "When you play this character, for each opposing player, you may choose a character of theirs. They can't ready at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "I-Aah",
    version: "Im Weg",
    text: [
      {
        title: "Danke für die Beachtung",
        description:
          "Für jeden erschöpften Charakter im Spiel zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Das tut mir leid",
        description:
          "Wenn du diesen Charakter ausspielst, wähle für jede gegnerische Person je einen ihrer Charaktere. Jene werden zu Beginn ihres nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Bourriquet",
    version: "En travers du chemin",
    text: [
      {
        title: "Merci de t'intéresser à moi",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins pour chaque personnage épuisé en jeu.",
      },
      {
        title: "Désolé pour ça",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir l'un des personnages de chaque adversaire. Ces personnages ne se redressent pas au début de leur prochain tour.",
      },
    ],
  },
  it: {
    name: "Ih-Oh",
    version: "In Mezzo",
    text: [
      {
        title: "Grazie per avermi notato",
        description:
          "Per ogni personaggio impegnato in gioco, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "Mi Dispiace",
        description:
          "Quando giochi questo personaggio, per ogni giocatore avversario, puoi scegliere un suo personaggio. Quel personaggio non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Eeyore",
    version: "En la vía",
    text: [
      {
        title: "GRACIAS POR NOTIFICARME",
        description:
          "Por cada personaje ejercido en juego, pagas 1 {I} menos para interpretar a este personaje.",
      },
      {
        title: "LO LAMENTO",
        description:
          "Cuando juegas con este personaje, para cada jugador contrario, puedes elegir un personaje suyo. No pueden prepararse al comienzo de su siguiente turno.",
      },
    ],
  },
};
