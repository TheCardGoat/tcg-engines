import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const todCopperBestOfFriendsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tod & Copper",
    version: "Best of Friends",
    text: [
      {
        title: "<Shift> 2 {I}",
      },
      {
        title: "<Evasive>",
      },
    ],
  },
  de: {
    name: "Cap & Capper",
    version: "Eine Freundschaft voller Vertrauen",
    text: [
      {
        title:
          "<Gestaltwandel> 2 {I} (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Cap oder Capper auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
    ],
  },
  fr: {
    name: "Rox & Rouky",
    version: "Deux copains",
    text: [
      {
        title:
          "<Alter> 2 {I} (Vous pouvez payer 2 {I} pour jouer ce personnage sur l'un de vos personnages nommé Rox ou Rouky.)",
      },
      {
        title: "<Insaisissable>",
      },
    ],
  },
  it: {
    name: "Red e Toby",
    version: "Ottimi Amici",
    text: [
      {
        title:
          "<Trasformazione> 2 {I} (Puoi pagare 2 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Red o Toby.)",
      },
      {
        title: "<Sfuggente>",
      },
    ],
  },
};
