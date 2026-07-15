import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const escapePlanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Escape Plan",
    text: [
      {
        title:
          "You can't play this action unless 2 or more cards were put into your discard this turn.",
      },
      {
        title:
          "Each player chooses 2 of their characters and puts them into their inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Fluchtplan",
    text: [
      {
        title:
          "Du kannst diese Aktion nicht ausspielen, außer in diesem Zug wurden mindestens 2 Karten auf deinen Ablagestapel gelegt.",
      },
      {
        title: "Alle Mitspielenden",
        description:
          "(auch du) wählen je 2 ihrer Charaktere und legen sie verdeckt und erschöpft in ihren Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "Plan d’évasion",
    text: [
      {
        title:
          "Vous ne pouvez pas jouer cette action, sauf si 2 cartes ou plus ont été placées dans votre défausse ce tour-ci.",
      },
      {
        title:
          "Chaque joueur choisit 2 de ses personnages et les place dans sa réserve d'encre, face cachée et épuisés.",
      },
    ],
  },
  it: {
    name: "Piano di Fuga",
    text: [
      {
        title:
          "Non puoi giocare questa azione a meno che 2 o più carte non siano state messe nei tuoi scarti in questo turno.",
      },
      {
        title:
          "Ogni giocatore sceglie 2 dei suoi personaggi e li aggiunge al suo calamaio, a faccia in giù e impegnati.",
      },
    ],
  },
};
