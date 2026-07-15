import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogeMcduckGhostlyEbenezerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge McDuck",
    version: "Ghostly Ebenezer",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "COUNTING COINS",
        description: "This character gets +1 {S} and +1 {W} for each card under him.",
      },
    ],
  },
  de: {
    name: "Dagobert Duck",
    version: "Geisterhafter Ebenezer",
    text: [
      {
        title:
          "<Stärken> 1 {I} (Einmal während deines Zuges darfst du 1 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Münzen zählen",
        description: "Dieser Charakter erhält für jede Karte unter ihm +1 {S} und +1 {W}.",
      },
    ],
  },
  fr: {
    name: "Balthazar Picsou",
    version: "Ebenezer fantôme",
    text: [
      {
        title:
          "<Boost> 1 {I} (Une fois durant votre tour, vous pouvez payer 1 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Comptant les pièces",
        description: "Ce personnage gagne +1 {S} et +1 {W} pour chaque carte sous lui.",
      },
    ],
  },
  it: {
    name: "Paperon de' Paperoni",
    version: "Ebenezer Spettrale",
    text: [
      {
        title:
          "<Potenziamento> 1 {I} (Una volta durante il tuo turno, puoi pagare 1 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Contare le Monete",
        description: "Questo personaggio riceve +1 {S} e +1 {W} per ogni carta sotto di sé.",
      },
    ],
  },
};
