import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pascalRapunzelsCompanionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pascal",
    version: "Rapunzel’s Companion",
    text: [
      {
        title: "Camouflage",
        description: "While you have another character in play, this character gains Evasive.",
      },
    ],
  },
  de: {
    name: "Pascal",
    version: "Rapunzels Begleiter",
    text: [
      {
        title: "Tarnung",
        description:
          "Dieser Charakter erhält Wendig, solange du mindestens einen weiteren Charakter im Spiel hast.",
      },
    ],
  },
  fr: {
    name: "PASCAL",
    version: "Compagnon de Raiponce",
    text: [
      {
        title: "CAMOUFLAGE",
        description:
          "Tant que vous avez un autre personnage en jeu, ce personnage gagne Insaisissable. (Seuls les personnages avec Insaisissable peuvent le défier.)",
      },
    ],
  },
  it: {
    name: "Pascal",
    version: "Rapunzel’s Companion",
    text: [
      {
        title: "Camouflage",
        description:
          "While you have another character in play, this character gains Evasive. (Only characters with Evasive can challenge them.)",
      },
    ],
  },
  es: {
    name: "Pascal",
    version: "El compañero de Rapunzel",
    text: [
      {
        title: "Camuflaje",
        description: "Mientras tengas otro personaje en juego, este personaje gana Evasivo.",
      },
    ],
  },
};
