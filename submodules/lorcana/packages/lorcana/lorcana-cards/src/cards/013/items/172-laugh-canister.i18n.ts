import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const laughCanisterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Laugh Canister",
    text: [
      {
        title: "Copycat",
        description:
          "{E} — Put the top card of your deck into your inkwell facedown and exerted. Chosen opponent may put the top card of their deck into their inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Lachkanister",
    text: [
      {
        title: "Nachahmer",
        description:
          "{E} — Lege die oberste Karte deines Decks verdeckt und erschöpft in deinen Tintenvorrat. Eine gegnerische Person deiner Wahl darf die oberste Karte ihres Decks verdeckt und erschöpft in ihren Tintenvorrat legen.",
      },
    ],
  },
  fr: {
    name: "Bonbonne de rire",
    text: [
      {
        title: "Imitateur",
        description:
          "{E} — Placez la carte du dessus de votre pioche dans votre réserve d'encre, face cachée et épuisée. Choisissez un adversaire qui peut placer la carte du dessus de sa pioche dans sa réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Cilindro per le Risate",
    text: [
      {
        title: "Imitare",
        description:
          "{E} — Aggiungi la prima carta del tuo mazzo al tuo calamaio, a faccia in giù e impegnata. Un avversario a tua scelta può aggiungere la prima carta del suo mazzo al suo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
  es: {
    name: "Bote de risa",
    text: [
      {
        title: "Imitador",
        description:
          "{E}: coloca la carta superior de tu mazo en tu tintero boca abajo y ejercítala. El oponente elegido puede poner la carta superior de su mazo en su tintero boca abajo y ejercerla.",
      },
    ],
  },
};
