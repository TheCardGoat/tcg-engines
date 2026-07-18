import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const demonaBetrayerOfTheClanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Demona",
    version: "Betrayer of the Clan",
    text: [
      {
        title: "Challenger +2",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Demona",
    version: "Verräterin des Clans",
    text: [
      {
        title: "<Herausfordern> +2 (Während dieser Charakter herausfordert, erhält er +2 {S}.)",
      },
      {
        title: "Am Tage aus Stein",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Démona",
    version: "Traîtresse du clan",
    text: [
      {
        title: "<Offensif> +2",
      },
      {
        title: "Statue le jour",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Demona",
    version: "Traditrice del Clan",
    text: [
      {
        title: "<Sfidante> +2",
      },
      {
        title: "Statue di Giorno",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
  es: {
    name: "Demonio",
    version: "Traidor del clan",
    text: [
      {
        title: "Retador +2",
      },
      {
        title: "PIEDRA DE DÍA",
        description: "Si tienes 3 o más cartas en tu mano, este personaje no puede prepararse.",
      },
    ],
  },
};
