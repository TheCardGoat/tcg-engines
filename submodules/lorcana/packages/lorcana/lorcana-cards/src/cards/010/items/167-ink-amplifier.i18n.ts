import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const inkAmplifierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ink Amplifier",
    text: [
      {
        title: "ENERGY CAPTURE",
        description:
          "Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Tintenverstärker",
    text: [
      {
        title: "ENERGIEGEWINNUNG",
        description:
          "Jedes Mal, wenn eine gegnerische Person in ihrem Zug 1 Karte zieht und falls es die zweite Karte ist, die sie in diesem Zug zieht, darfst du die oberste Karte deines Decks verdeckt und erschöpft in deinen Tintenvorrat legen.",
      },
    ],
  },
  fr: {
    name: "Amplificateur d'encre",
    text: [
      {
        title: "CAPTURE D'ÉNERGIE",
        description:
          "Chaque fois qu'un adversaire pioche une carte durant son tour, si c'est la deuxième qu'il pioche ce tour-ci, vous pouvez placer la carte du dessus de votre pioche dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Amplificatore d'Inchiostro",
    text: [
      {
        title: "CATTURARE ENERGIA",
        description:
          "Ogni volta che un avversario pesca una carta durante il suo turno, se è la seconda carta che ha pescato in questo turno, puoi aggiungere la prima carta del tuo mazzo al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
};
