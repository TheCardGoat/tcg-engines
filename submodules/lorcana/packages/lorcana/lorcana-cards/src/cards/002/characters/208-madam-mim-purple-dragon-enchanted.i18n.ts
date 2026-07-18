import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madamMimPurpleDragonEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Madam Mim",
    version: "Purple Dragon",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "I WIN, I WIN!",
        description:
          "When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
      },
    ],
  },
  de: {
    name: "Madame Mim",
    version: "Lila Drache",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Gewonnen, gewonnen!",
        description:
          "Wenn du diesen Charakter ausspielst, musst du ihn verbannen oder 2 deiner anderen Charaktere wählen und zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Madame Mime",
    version: "En dragon",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Je l'ai eu, j'ai gagné!",
        description:
          "Lorsque vous jouez ce personnage, bannissez-le ou renvoyez 2 de vos autres personnages en jeu dans votre main.",
      },
    ],
  },
  it: {
    name: "Madam Mim",
    version: "Purple Dragon",
    text: [
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "I Win, I Win!",
        description:
          "When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
      },
    ],
  },
  es: {
    name: "Señora mim",
    version: "Dragón Púrpura",
    text: [
      {
        title: "Evasivo",
      },
      {
        title: "¡YO GANO, YO GANO!",
        description:
          "Cuando juegues con este personaje, destiérralo o devuelve otros 2 personajes tuyos elegidos a tu mano.",
      },
    ],
  },
};
