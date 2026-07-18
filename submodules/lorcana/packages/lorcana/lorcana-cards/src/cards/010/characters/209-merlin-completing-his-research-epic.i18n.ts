import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinCompletingHisResearchEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Completing His Research",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "LEGACY OF LEARNING",
        description:
          "When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Vollendet seine Forschung",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Erbe des Lernens",
        description:
          "Wenn dieser Charakter durch eine Herausforderung verbannt wird, falls er mindestens eine Karte unter sich hatte, ziehe 2 Karten.",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "Terminant ses recherches",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Héritage de connaissances",
        description:
          "Lorsque ce personnage est banni via un défi, s'il y avait une carte sous lui, piochez 2 cartes.",
      },
    ],
  },
  it: {
    name: "Merlino",
    version: "Che Completa le Sue Ricerche",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "L'Eredità dell'Erudito",
        description:
          "Quando questo personaggio viene esiliato in una sfida, se aveva una carta sotto di sé, pesca 2 carte.",
      },
    ],
  },
  es: {
    name: "Esmerejón",
    version: "Completando su investigación",
    text: [
      {
        title: "Impulsar 2 {I}",
      },
      {
        title: "LEGADO DEL APRENDIZAJE",
        description:
          "Cuando este personaje es desterrado en un desafío, si tenía una carta debajo, roba 2 cartas.",
      },
    ],
  },
};
