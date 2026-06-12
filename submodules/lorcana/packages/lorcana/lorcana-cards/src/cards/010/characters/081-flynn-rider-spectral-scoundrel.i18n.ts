import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flynnRiderSpectralScoundrelI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flynn Rider",
    version: "Spectral Scoundrel",
    text: [
      {
        title: "Boost 2 {I}",
        description:
          "(Once during your turn, you may pay 2 {I} to put the top card of your deck face down under this character.)",
      },
      {
        title: "I'LL TAKE THAT",
        description:
          "As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.",
      },
    ],
  },
  de: {
    name: "Flynn Rider",
    version: "Geisterhafter Schurke",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "DAS NEHME ICH",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +2 und +1.",
      },
    ],
  },
  fr: {
    name: "Flynn Rider",
    version: "Crapule spectrale",
    text: [
      {
        title: "Boost 2",
      },
      {
        title: "JE VAIS PRENDRE ÇA",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne +2 et +1.",
      },
    ],
  },
  it: {
    name: "Flynn Rider",
    version: "Furfante Spettrale",
    text: [
      {
        title: "Potenziamento 2",
        description:
          "(Una volta durante il tuo turno, puoi pagare 2 per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "QUESTA LA PRENDO IO",
        description: "Mentre c'è una carta sotto a questo personaggio, questo riceve +2 e +1.",
      },
    ],
  },
};
