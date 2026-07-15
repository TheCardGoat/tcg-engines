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
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Gutes Geschäft",
        description: "Dieser Ort erhält für jede Karte unter ihm +1 {W} und +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Maison de comptage de Scrooge",
    version: "Bureau d'Ebenezer",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous ce lieu, face cachée.)",
      },
      {
        title: "Bonnes affaires",
        description: "Ce lieu gagne +1 {W} et +1 {L} pour chaque carte sous lui.",
      },
    ],
  },
  it: {
    name: "Ufficio Contabile di Scrooge",
    version: "Scrivania di Ebenezer",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo luogo.)",
      },
      {
        title: "Buoni Affari",
        description: "Questo luogo riceve +1 {W} e +1 {L} per ogni carta sotto di sé.",
      },
    ],
  },
};
