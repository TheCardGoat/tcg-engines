import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const poseyVampirePotatoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Posey",
    version: "Vampire Potato",
    text: [
      {
        title: "Potato Shift 5 {I}",
        description: "(You may pay 5 {I} to play this on top of one of your items named Potato.)",
      },
    ],
  },
  de: {
    name: "Knolli",
    version: "Vampir-Kartoffel",
    text: "<Kartoffel-Gestaltwandel> 5 {I} (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Gegenstände namens Kartoffel auszuspielen.)",
  },
  fr: {
    name: "Rosie",
    version: "Patate vampire",
    text: "<Alter de Patate> 5 {I} (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos objets nommé Patate.)",
  },
  it: {
    name: "Fiorellino",
    version: "Patata Vampiro",
    text: "<Trasformazione Patata> 5 {I} (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi oggetti chiamato Patata.)",
  },
  es: {
    name: "Posey",
    version: "Patata vampiro",
    text: [
      {
        title: "Cambio de papa 5 {I}",
        description:
          "(Puedes pagar 5 {I} para jugar esto encima de uno de tus artículos llamado Potato).",
      },
    ],
  },
};
