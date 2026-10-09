import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseBestInTownI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Best in Town",
    text: [
      {
        title: "Adventurous",
        description: "(This character can't challenge and must quest each turn if able.)",
      },
      {
        title: "HOT DOG!",
        description:
          "At the end of your turn, if this character is exerted, each player gets 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Der Beste der Stadt",
    text: [
      {
        title:
          "<Abenteuerlustig> (Dieser Charakter kann nicht herausfordern und muss in jedem Zug erkunden, wenn möglich.)",
      },
      {
        title: "Hot Dog!",
        description:
          "Am Ende deines Zuges, falls dieser Charakter erschöpft ist, erhalten alle Mitspielenden 1 Tintentropfen. (Ein Tintentropfen kann entfernt werden, um 1 {I} zu bezahlen.)",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Le meilleur de la ville",
    text: [
      {
        title:
          "<Appel de l'aventure> (Ce personnage ne peut pas défier et doit être envoyé à l'aventure à chaque tour s'il le peut.)",
      },
      {
        title: "Hot Dog!",
        description:
          "À la fin de votre tour, si ce personnage est épuisé, chaque joueur gagne 1 goutte d'encre. (Vous pouvez retirer l'une de vos gouttes d'encre pour payer 1 {I}.)",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Il Migliore in Città",
    text: [
      {
        title:
          "<Avventuroso> (Questo personaggio non può sfidare e deve andare all'avventura ogni turno, se possibile.)",
      },
      {
        title: "Hot Dog!",
        description:
          "Alla fine del tuo turno, se questo personaggio è impegnato, ogni giocatore riceve 1 goccia d'inchiostro. (Ogni goccia d'inchiostro può essere rimossa per pagare 1 {I}.)",
      },
    ],
  },
  es: {
    name: "Mickey Mouse",
    version: "Best in Town",
    text: [
      {
        title: "Adventurous",
        description: "(This character can't challenge and must quest each turn if able.)",
      },
      {
        title: "HOT DOG!",
        description:
          "At the end of your turn, if this character is exerted, each player gets 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
      },
    ],
  },
};
