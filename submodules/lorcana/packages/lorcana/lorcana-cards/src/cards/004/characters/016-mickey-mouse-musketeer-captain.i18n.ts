import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseMusketeerCaptainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Musketeer Captain",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Bodyguard, Support",
      },
      {
        title: "MUSKETEERS UNITED",
        description:
          "When you play this character, if you used Shift to play him, you may draw a card for each character with Bodyguard you have in play.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Kapitän der Musketiere",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Micky-Maus-Charaktere auszuspielen.)",
      },
      {
        title: "<Beschützen>, <Unterstützen>",
      },
      {
        title: "Musketiere vereint",
        description:
          "Falls du <Gestaltwandel> benutzt hast, um diesen Charakter auszuspielen, darfst du für jeden deiner Charaktere mit <Beschützen> im Spiel 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Capitaine Mousquetaire",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Mickey Mouse.)",
      },
      {
        title: "<Rempart>, <Soutien>",
      },
      {
        title: "Mousquetaires Unis",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité <Alter>, vous pouvez piocher une carte pour chaque personnage avec <Rempart> que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Capitano Moschettiere",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Topolino.)",
      },
      {
        title: "<Guardiano>, <Aiutante>",
      },
      {
        title: "Moschettieri Uniti",
        description:
          "Quando giochi questo personaggio, se hai usato <Trasformazione> per giocarlo, puoi pescare una carta per ogni personaggio con <Guardiano> che hai in gioco.",
      },
    ],
  },
};
