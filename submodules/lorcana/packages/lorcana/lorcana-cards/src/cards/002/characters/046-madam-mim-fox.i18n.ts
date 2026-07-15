import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madamMimFoxI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Madam Mim",
    version: "Fox",
    text: [
      {
        title: "CHASING THE RABBIT",
        description:
          "When you play this character, banish her or return another chosen character of yours to your hand.",
      },
      {
        title: "Rush",
      },
    ],
  },
  de: {
    name: "Madame Mim",
    version: "Fuchs",
    text: [
      {
        title: "Dem Hasen nachjagen",
        description:
          "Wenn du diesen Charakter ausspielst, musst du ihn verbannen oder einen deiner anderen Charaktere wählen und zurück auf deine Hand nehmen.",
      },
      {
        title: "<Rasant>",
      },
    ],
  },
  fr: {
    name: "Madame Mime",
    version: "En renard",
    text: [
      {
        title: "À la poursuite du lapin",
        description:
          "Lorsque vous jouez ce personnage, bannissez-le ou renvoyez l'un de vos autres personnages en jeu dans votre main.",
      },
      {
        title: "<Charge>",
      },
    ],
  },
  it: {
    name: "Maga Magò",
    version: "Volpe",
    text: [
      {
        title: "Inseguire il Coniglio",
        description:
          "Quando giochi questo personaggio, esilialo o riprendi in mano un tuo altro personaggio a tua scelta.",
      },
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
