import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogesCountingHouseEbenezersOfficeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge's Counting House",
    version: "Ebenezer's Office",
    text: [
      {
        title: "Boost 2 {I}",
        description:
          "(Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this location.)",
      },
      {
        title: "Good Business This location gets +1 {W} and +1 {L} for each card under it.",
      },
    ],
  },
  de: {
    name: "Scrooges Schatzmeisterei",
    version: "Ebenezers Büro",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "GUTES GESCHÄFT",
        description: "Dieser Ort erhält für jede Karte unter ihm +1 und +1.",
      },
    ],
  },
  fr: {
    name: "Maison de comptage de Scrooge",
    version: "Bureau d'Ebenezer",
    text: [
      {
        title: "Boost 2",
        description:
          "(Une fois durant votre tour, vous pouvez payer 2 pour placer la carte du dessus de votre pioche sous ce lieu, face cachée.)",
      },
      {
        title: "BONNES AFFAIRES",
        description: "Ce lieu gagne +1 et +1 pour chaque carte sous lui.",
      },
    ],
  },
  it: {
    name: "Ufficio Contabile di Scrooge",
    version: "Scrivania di Ebenezer",
    text: [
      {
        title: "Potenziamento 2",
        description:
          "(Una volta durante il tuo turno, puoi pagare 2 per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo luogo.)",
      },
      {
        title: "BUONI AFFARI",
        description: "Questo luogo riceve +1 e +1 per ogni carta sotto di sé.",
      },
    ],
  },
};
