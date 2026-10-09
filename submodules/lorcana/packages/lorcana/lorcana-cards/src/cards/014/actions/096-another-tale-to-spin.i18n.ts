import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const anotherTaleToSpinI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Another Tale to Spin",
    text: "Draw a card. You and another chosen player each get 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
  },
  de: {
    name: "Balu und seine Crew",
    text: "Ziehe 1 Karte. Du und eine weitere Person deiner Wahl erschaffen je 1 Tintentropfen. (Ein Tintentropfen kann entfernt werden, um 1 {I} zu bezahlen.)",
  },
  fr: {
    name: "Voilà Super Baloo",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Piochez une carte. Vous et un autre joueur de votre choix gagnez chacun 1 goutte d'encre. (Vous pouvez retirer l'une de vos gouttes d'encre pour payer 1 {I}.)",
      },
    ],
  },
  it: {
    name: "Tutto Quello che Accadrà",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Pesca una carta. Tu e un altro giocatore a tua scelta ricevete ciascuno 1 goccia d'inchiostro. (Ogni goccia d'inchiostro può essere rimossa per pagare 1 {I}.)",
      },
    ],
  },
  es: {
    name: "Another Tale to Spin",
    text: "Draw a card. You and another chosen player each get 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
  },
};
