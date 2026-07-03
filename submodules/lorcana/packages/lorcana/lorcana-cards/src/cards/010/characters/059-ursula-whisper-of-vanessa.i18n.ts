import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulaWhisperOfVanessaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula",
    version: "Whisper of Vanessa",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "SLIPPERY SPELL",
        description:
          "While there's a card under this character, she gets +1 {L} and gains Evasive.",
      },
    ],
  },
  de: {
    name: "Ursula",
    version: "Geflüster von Vanessa",
    text: [
      {
        title:
          "<Stärken> 1 {I} (Einmal während deines Zuges darfst du 1 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Gerissener Zauber",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +1 {L} und <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Ursula",
    version: "Lueur de Vanessa",
    text: [
      {
        title:
          "<Boost> 1 {I} (Une fois durant votre tour, vous pouvez payer 1 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Sort évasif",
        description:
          "Tant qu'il y a une carte sous ce personnage, il gagne +1 {L} et <Insaisissable>.",
      },
    ],
  },
  it: {
    name: "Ursula",
    version: "Sussurro di Vanessa",
    text: [
      {
        title:
          "<Potenziamento> 1 {I} (Una volta durante il tuo turno, puoi pagare 1 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Incantesimo Subdolo",
        description:
          "Mentre c'è una carta sotto a questo personaggio, questo riceve +1 {L} e ottiene <Sfuggente>. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
