import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jasmineRoyalCommodoreI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jasmine",
    version: "Royal Commodore",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "RULER OF THE SEAS",
        description:
          "When you play this character, if you used Shift to play her, return all other exerted characters to their players' hands.",
      },
    ],
  },
  de: {
    name: "Jasmin",
    version: "Königliche Kommodorin",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Jasmin-Charaktere auszuspielen.)",
      },
      {
        title: "Herrscherin der Meere",
        description:
          "Falls du <Gestaltwandel> benutzt hast, um diesen Charakter auszuspielen, schicke alle anderen erschöpften Charaktere auf die zugehörigen Hände zurück.",
      },
    ],
  },
  fr: {
    name: "Jasmine",
    version: "Commodore royale",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Jasmine.)",
      },
      {
        title: "Régente des mers",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité <Alter>, renvoyez tous les autres personnages épuisés dans la main de leur propriétaire.",
      },
    ],
  },
  it: {
    name: "Jasmine",
    version: "Commodoro Reale",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Jasmine.)",
      },
      {
        title: "Sovrana dei Mari",
        description:
          "Quando giochi questo personaggio, se hai usato <Trasformazione> per giocarlo, fai riprendere in mano ai loro giocatori tutti gli altri personaggi impegnati.",
      },
    ],
  },
};
