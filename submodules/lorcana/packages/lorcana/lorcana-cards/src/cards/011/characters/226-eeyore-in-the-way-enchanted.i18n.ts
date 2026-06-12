import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const eeyoreInTheWayEnchantedI18n: Record<Languages, I18nProperties> = {
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
        title: "DANKE FÜR DIE BEACHTUNG",
        description:
          "Für jeden erschöpften Charakter im Spiel zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "DAS TUT MIR LEID",
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
        title: "MERCI DE T'INTÉRESSER À MOI",
        description:
          "Jouer ce personnage vous coûte 1 de moins pour chaque personnage épuisé en jeu.",
      },
      {
        title: "DÉSOLÉ POUR ÇA",
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
        title: "GRAZIE PER AVERMI NOTATO",
        description:
          "Per ogni personaggio impegnato in gioco, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "MI DISPIACE",
        description:
          "Quando giochi questo personaggio, per ogni giocatore avversario, puoi scegliere un suo personaggio. Quel personaggio non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
};
