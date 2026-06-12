import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rapunzelAppreciativeArtistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rapunzel",
    version: "Appreciative Artist",
    text: [
      {
        title: "PERCEPTIVE PARTNER",
        description: "While you have a character named Pascal in play, this character gains Ward.",
      },
    ],
  },
  de: {
    name: "Rapunzel",
    version: "Wertschätzende Künstlerin",
    text: [
      {
        title: "EINFÜHLSAME PARTNERIN",
        description:
          "Solange du mindestens einen Pascal-Charakter im Spiel hast, erhält dieser Charakter Behütet.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Artiste sensible",
    text: [
      {
        title: "PARTENAIRE PERSPICACE",
        description:
          "Tant que vous avez un personnage Pascal en jeu, ce personnage-ci gagne Hors d'atteinte.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Artista Entusiasta",
    text: [
      {
        title: "COMPAGNO PERSPICACE",
        description:
          "Mentre hai in gioco un personaggio chiamato Pascal, questo personaggio ottiene Protetto. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
};
