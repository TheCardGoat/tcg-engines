import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aladdinResearchAssistantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aladdin",
    version: "Research Assistant",
    text: [
      {
        title: "HELPING HAND",
        description:
          "Whenever this character quests, you may play an Ally character with cost 3 or less for free.",
      },
      {
        title: "PUT IN THE EFFORT",
        description: "While this character is exerted, your Ally characters get +1 {S}.",
      },
    ],
  },
  de: {
    name: "Aladdin",
    version: "Wissenschaftlicher Mitarbeiter",
    text: [
      {
        title: "HELFENDE HAND",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einen Verbündeten, der 3 oder weniger kostet, kostenlos ausspielen.",
      },
      {
        title: "STRENGT SICH AN",
        description: "Solange dieser Charakter erschöpft ist, erhalten deine Verbündeten +1.",
      },
    ],
  },
  fr: {
    name: "Aladdin",
    version: "Assistant de recherche",
    text: [
      {
        title: "MAIN TENDUE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez jouer gratuitement un personnage Allié coûtant 3 ou moins.",
      },
      {
        title: "SE DONNER DU MAL",
        description: "Tant que ce personnage est épuisé, vos personnages Allié gagnent +1.",
      },
    ],
  },
  it: {
    name: "Aladdin",
    version: "Assistente di Ricerca",
    text: [
      {
        title: "DARE UNA MANO",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi giocare un personaggio Alleato con costo 3 o inferiore, gratis.",
      },
      {
        title: "METTERCI IMPEGNO",
        description:
          "Mentre questo personaggio è impegnato, i tuoi personaggi Alleato ricevono +1.",
      },
    ],
  },
};
