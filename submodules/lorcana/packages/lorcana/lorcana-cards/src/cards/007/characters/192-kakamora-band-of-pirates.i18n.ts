import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kakamoraBandOfPiratesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kakamora",
    version: "Band of Pirates",
    text: [
      {
        title: "SHOWBOATING",
        description:
          "While you have another Pirate character in play, this character gains Challenger +3.",
      },
    ],
  },
  de: {
    name: "Kokomora",
    version: "Piratenbande",
    text: [
      {
        title: "ANGEBEREI",
        description:
          "Solange du mindestens einen weiteren Piraten im Spiel hast, erhält dieser Charakter Herausfordern +3. (Während der Charakter herausfordert, erhält er +3.)",
      },
    ],
  },
  fr: {
    name: "Kakamora",
    version: "Bande de pirates",
    text: [
      {
        title: "FANFARONNADE",
        description:
          "Tant que vous avez un autre personnage Pirate en jeu, ce personnage-ci gagne Offensif +3.",
      },
    ],
  },
  it: {
    name: "Kakamora",
    version: "Banda di Pirati",
    text: [
      {
        title: "METTERSI IN MOSTRA",
        description:
          "Mentre hai in gioco un altro personaggio Pirata, questo personaggio ottiene Sfidante +3.",
      },
    ],
  },
};
