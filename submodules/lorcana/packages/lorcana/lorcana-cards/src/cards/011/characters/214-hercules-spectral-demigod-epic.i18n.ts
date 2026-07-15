import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesSpectralDemigodEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "Spectral Demigod",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "SUPERHUMAN STRENGTH",
        description: "While there's a card under this character, he gets +3 {S}.",
      },
    ],
  },
  de: {
    name: "Hercules",
    version: "Spektraler Halbgott",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Übermenschliche Kraft",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +3 {S}.",
      },
    ],
  },
  fr: {
    name: "Hercule",
    version: "Demi-dieu spectral",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Force surhumaine",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne +3 {S}.",
      },
    ],
  },
  it: {
    name: "Ercole",
    version: "Semidio Spettrale",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Forza Sovrumana",
        description: "Mentre c'è una carta sotto a questo personaggio, riceve +3 {S}.",
      },
    ],
  },
};
