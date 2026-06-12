import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeJohnsMirrorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince John's Mirror",
    text: [
      {
        title: "YOU LOOK REGAL",
        description:
          "If you have a character named Prince John in play, you pay 1 {I} less to play this item.",
      },
      {
        title: "A FEELING OF POWER",
        description:
          "At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
      },
    ],
  },
  de: {
    name: "Prinz Johns Spiegel",
    text: [
      {
        title: "JEDER ZOLL EIN KÖNIG",
        description:
          "Wenn du einen Prinz-John-Charakter im Spiel hast, zahlst du 1 weniger, um diesen Gegenstand auszuspielen.",
      },
      {
        title: "DAS GEFÜHL VON MACHT",
        description:
          "Am Ende des Zuges jeder gegnerischen Person und falls diese mehr als 3 Karten auf der Hand hat, muss diese Person so lange Karten von der Hand abwerfen, bis sie nur noch 3 Karten auf der Hand hat.",
      },
    ],
  },
  fr: {
    name: "Miroir du Prince Jean",
    text: [
      {
        title: "VOUS ÊTES UNE ROYALE IMAGE",
        description:
          "Jouer cet objet vous coûte 1 de moins si vous avez un personnage Prince Jean en jeu.",
      },
      {
        title: "UN SENTIMENT DE PUISSANCE À",
        description:
          "la fin du tour de chaque adversaire, s'il a plus de 3 cartes en main, il défausse des cartes jusqu'à en avoir 3 en main.",
      },
    ],
  },
  it: {
    name: "Specchio del Principe Giovanni",
    text: [
      {
        title: "VI DÀ UN ASPETTO REGALE",
        description:
          "Se hai in gioco un personaggio chiamato Principe Giovanni, paga 1 in meno per giocare questo oggetto.",
      },
      {
        title: "IL SENSO DEL POTERE",
        description:
          "Alla fine del turno di ogni avversario, se questo ha più di 3 carte in mano, deve scartare carte finché non ne ha 3 in mano.",
      },
    ],
  },
};
