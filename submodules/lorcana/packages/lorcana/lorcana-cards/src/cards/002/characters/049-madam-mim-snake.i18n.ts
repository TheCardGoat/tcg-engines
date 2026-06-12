import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madamMimSnakeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Madam Mim",
    version: "Snake",
    text: [
      {
        title: "JUST YOU WAIT",
        description:
          "When you play this character, banish her or return another chosen character of yours to your hand.",
      },
    ],
  },
  de: {
    name: "Madame Mim",
    version: "Schlange",
    text: [
      {
        title: "NA WARTE!",
        description:
          "Wenn du diesen Charakter ausspielst, musst du ihn verbannen oder einen deiner anderen Charaktere wählen und zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Madame Mime",
    version: "En serpent",
    text: [
      {
        title: "ATTENDEZ UN PEU",
        description:
          "Lorsque vous jouez ce personnage, bannissez-le ou renvoyez l'un de vos autres personnages en jeu dans votre main.",
      },
    ],
  },
  it: {
    name: "Maga Magò",
    version: "Serpente",
    text: [
      {
        title: "ASPETTA E VEDRAI",
        description:
          "Quando giochi questo personaggio, esilialo o riprendi in mano un tuo altro personaggio a tua scelta.",
      },
    ],
  },
};
