import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nextStopOlympusI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Next Stop, Olympus",
    text: [
      {
        title: "ACTION",
        description:
          "If you have a character with 5 {S} or more in play, you pay 2 {I} less to play this action.",
      },
      {
        title:
          "Ready chosen character. They can't quest for the rest of this turn. The next time they challenge another character this turn, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Nächster Halt, Olymp",
    text: [
      {
        title:
          "Wenn du mindestens einen Charakter mit 5 oder mehr {S} im Spiel hast, zahlst du 2 {I} weniger, um diese Aktion auszuspielen.",
      },
      {
        title:
          "Mache einen Charakter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden. Das nächste Mal während dieses Zuges, wenn er einen anderen Charakter herausfordert, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Prochaine étape, l’Olympe !",
    text: [
      {
        title:
          "Jouer cette action vous coûte 2 {I} de moins si vous avez en jeu un personnage ayant 5 {S} ou plus.",
      },
      {
        title:
          "Choisissez un personnage et redressez-le. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour. La prochaine fois qu'il défie un autre personnage ce tour-ci, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Prossima Fermata, Olimpo",
    text: [
      {
        title:
          "Se hai in gioco un personaggio con 5 {S} o superiore, paga 2 {I} in meno per giocare questa azione.",
      },
      {
        title:
          "Prepara un personaggio a tua scelta. Non può andare all'avventura per il resto di questo turno. La prossima volta che sfida un altro personaggio per questo turno, ottieni 1 leggenda.",
      },
    ],
  },
  es: {
    name: "Próxima parada, el Olimpo",
    text: [
      {
        title: "ACCIÓN",
        description:
          "Si tienes un personaje con 5 {S} o más en juego, pagas 2 {I} menos para realizar esta acción.",
      },
      {
        title:
          "Personaje elegido listo. No pueden realizar misiones durante el resto de este turno. La próxima vez que desafíen a otro personaje este turno, gana 1 conocimiento.",
      },
    ],
  },
};
