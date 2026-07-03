import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPanPiratesBaneEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan",
    version: "Pirate's Bane",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "Evasive",
      },
      {
        title: "YOU'RE NEXT!",
        description:
          "Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
      },
    ],
  },
  de: {
    name: "Peter Pan",
    version: "Piratenfluch",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Peter-Pan-Charaktere auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Du bist der Nächste!",
        description:
          "Dieser Charakter erhält keinen Schaden durch Herausforderungen, während er einen Piraten oder eine Piratin herausfordert.",
      },
    ],
  },
  fr: {
    name: "Peter Pan",
    version: "Fléau des pirates",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Peter Pan.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Au suivant!",
        description: "Ce personnage ne subit pas de dommage lorsqu'il défie un personnage Pirate.",
      },
    ],
  },
  it: {
    name: "Peter Pan",
    version: "Flagello dei Pirati",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Peter Pan.)",
      },
      {
        title: "<Sfuggente>",
      },
      {
        title: "Sei il Prossimo!",
        description:
          "Ogni volta che sfida un personaggio Pirata, questo personaggio non subisce danni dalla sfida.",
      },
    ],
  },
};
