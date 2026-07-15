import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kangaPeacefulGathererI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kanga",
    version: "Peaceful Gatherer",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "EXTRA HELP",
        description: "While there's a card under this character, she gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Kanga",
    version: "Friedliche Sammlerin",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Zusätzliche Hilfe",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Maman Gourou",
    version: "Cueilleuse paisible",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Petite aide en plus",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne +1 {L}.",
      },
    ],
  },
  it: {
    name: "Kanga",
    version: "Raccoglitrice Serena",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Aiuto Aggiuntivo",
        description: "Mentre c'è una carta sotto a questo personaggio, riceve +1 {L}.",
      },
    ],
  },
};
