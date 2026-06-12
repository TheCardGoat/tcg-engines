import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogeMcduckEbenezerScroogeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge McDuck",
    version: "Ebenezer Scrooge",
    text: [
      {
        title: "PAYMENT DUE",
        description:
          "Whenever this character quests, each opponent loses 1 lore. Draw a card for each 1 lore lost this way.",
      },
      {
        title: "FORECLOSURE",
        description: "At the end of your turn, if an opponent has 0 lore, you gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Dagobert Duck",
    version: "Ebenezer Scrooge",
    text: [
      {
        title: "FÄLLIGE ZAHLUNG",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, verlieren alle gegnerischen Mitspielenden je 1 Legende. Ziehe 1 Karte für jede auf diese Weise verlorene Legende.",
      },
      {
        title: "ZWANGSVOLLSTRECKUNG",
        description:
          "Am Ende deines Zuges, wenn mindestens eine gegnerische Person 0 Legenden hat, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Balthazar Picsou",
    version: "Ebenezer Scrooge",
    text: [
      {
        title: "ÉCHÉANCE DE PAIEMENT",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, chaque adversaire perd 1 éclat de Lore. Piochez une carte pour chaque éclat de Lore ainsi perdu.",
      },
      {
        title: "SAISIE À",
        description:
          "la fin de votre tour, si un adversaire a 0 éclat de Lore, vous gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Paperon de' Paperoni",
    version: "Ebenezer Scrooge",
    text: [
      {
        title: "RATA DA PAGARE",
        description:
          "Ogni volta che questo personaggio va all'avventura, ogni avversario perde 1 leggenda. Pesca una carta per ogni singola leggenda persa in questo modo.",
      },
      {
        title: "PIGNORAMENTO",
        description: "Alla fine del tuo turno, se un avversario ha 0 leggenda, ottieni 1 leggenda.",
      },
    ],
  },
};
