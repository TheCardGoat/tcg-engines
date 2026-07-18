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
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Das nehme ich",
        description:
          "Solange dieser Charakter mindestens eine Karte unter sich hat, erhält er +2 {S} und +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Flynn Rider",
    version: "Crapule spectrale",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Je vais prendre ça",
        description: "Tant qu'il y a une carte sous ce personnage, il gagne +2 {S} et +1 {L}.",
      },
    ],
  },
  it: {
    name: "Flynn Rider",
    version: "Furfante Spettrale",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Questa La Prendo Io",
        description:
          "Mentre c'è una carta sotto a questo personaggio, questo riceve +2 {S} e +1 {L}.",
      },
    ],
  },
  es: {
    name: "Jinete Flynn",
    version: "Sinvergüenza espectral",
    text: [
      {
        title: "Impulsar 2 {I}",
        description:
          "(Una vez durante tu turno, puedes pagar 2 {I} para poner la carta superior de tu mazo boca abajo debajo de este personaje).",
      },
      {
        title: "TOMARÉ ESO",
        description:
          "Siempre que este personaje tenga al menos una carta debajo, obtiene +2 {S} y +1 {L}.",
      },
    ],
  },
};
