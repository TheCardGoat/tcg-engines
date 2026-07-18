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
        title: "Einfühlsame Partnerin",
        description:
          "Solange du mindestens einen Pascal-Charakter im Spiel hast, erhält dieser Charakter <Behütet>.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Artiste sensible",
    text: [
      {
        title: "Partenaire perspicace",
        description:
          "Tant que vous avez un personnage Pascal en jeu, ce personnage-ci gagne <Hors d'atteinte>.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Artista Entusiasta",
    text: [
      {
        title: "Compagno Perspicace",
        description:
          "Mentre hai in gioco un personaggio chiamato Pascal, questo personaggio ottiene <Protetto>. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
  es: {
    name: "Rapunzel",
    version: "Artista agradecido",
    text: [
      {
        title: "SOCIO PERCEPTIVO",
        description:
          "Mientras tengas un personaje llamado Pascal en juego, este personaje gana Protección.",
      },
    ],
  },
};
