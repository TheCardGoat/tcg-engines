import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const queenOfHeartsUnpredictableBullyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Queen of Hearts",
    version: "Unpredictable Bully",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "IF",
        description:
          "I LOSE MY TEMPER... Whenever another character is played, put a damage counter on them.",
      },
    ],
  },
  de: {
    name: "Die Herzkönigin",
    version: "Unberechenbare Tyrannin",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Die-Herzkönigin-Charaktere auszuspielen.)",
      },
      {
        title: "Wenn ich die Beherrschung verliere...",
        description:
          "Jedes Mal, wenn ein anderer Charakter ausgespielt wird, lege 1 Schadensmarker auf ihn.",
      },
    ],
  },
  fr: {
    name: "La Reine de Cœur",
    version: "Despote imprévisible",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages La Reine de Cœur.)",
      },
      {
        title: "Si jamais je perdais mon sang-froid",
        description: "Chaque fois qu'un autre personnage est joué, placez un dommage sur lui.",
      },
    ],
  },
  it: {
    name: "La Regina di Cuori",
    version: "Imprevedibile Prepotente",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato La Regina di Cuori.)",
      },
      {
        title: "Se Io Perdo le Staffe...",
        description:
          "Ogni volta che un altro personaggio viene giocato, metti un segnalino danno su di esso.",
      },
    ],
  },
};
