import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarEerilyPreparedP3ChallengeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scar",
    version: "Eerily Prepared",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "SURVIVAL OF THE FITTEST",
        description:
          "Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Scar",
    version: "Unheimlich bereit",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Das Überleben des Stärkeren",
        description:
          "Jedes Mal, wenn du eine Karte unter diesen Charakter legst, gib einem gegnerischen Charakter deiner Wahl in diesem Zug -5 {S}.",
      },
    ],
  },
  fr: {
    name: "Scar",
    version: "Étrangement prêt",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Survie du plus apte",
        description:
          "Chaque fois que vous placez une carte sous ce personnage, choisissez un personnage adverse qui subit -5 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Misteriosamente Pronto",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Legge della Giungla",
        description:
          "Ogni volta che metti una carta sotto a questo personaggio, un personaggio avversario a tua scelta riceve -5 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Cicatriz",
    version: "Inquietantemente preparado",
    text: [
      {
        title: "Impulsar 2 {I}",
      },
      {
        title: "SUPERVIVENCIA DEL MÁS APTO",
        description:
          "Cada vez que pones una carta debajo de este personaje, el personaje contrario elegido obtiene -5 {S} este turno.",
      },
    ],
  },
};
