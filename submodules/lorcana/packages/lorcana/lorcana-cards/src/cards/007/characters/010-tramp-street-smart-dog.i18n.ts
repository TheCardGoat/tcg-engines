import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trampStreetsmartDogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tramp",
    version: "Street-Smart Dog",
    text: [
      {
        title: "NOW IT'S A PARTY",
        description:
          "For each character you have in play, you pay 1 {I} less to play this character.",
      },
      {
        title: "HOW'S PICKINGS?",
        description:
          "When you play this character, you may draw a card for each other character you have in play, then choose and discard that many cards.",
      },
    ],
  },
  de: {
    name: "Strolch",
    version: "Schlauer Hund",
    text: [
      {
        title: "JETZT IST ES EINE PARTY",
        description:
          "Für jeden deiner Charaktere im Spiel zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "WIEDER AM TURTELN?",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du für jeden deiner anderen Charaktere im Spiel eine Karte ziehen. Wähle danach dieselbe Anzahl Karten aus deiner Hand und wirf sie ab.",
      },
    ],
  },
  fr: {
    name: "Clochard",
    version: "Chien débrouillard",
    text: [
      {
        title: "LA FÊTE, C'EST MAINTENANT",
        description:
          "Jouer ce personnage vous coûte 1 de moins pour chaque personnage que vous avez en jeu.",
      },
      {
        title: "ON PICORE?",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez piocher une carte pour chaque autre personnage que vous avez en jeu. Ensuite, défaussez autant de cartes que vous en avez pioché.",
      },
    ],
  },
  it: {
    name: "Biagio",
    version: "Cane Scaltro",
    text: [
      {
        title: "ORA SÌ CHE È UNA FESTA",
        description:
          "Per ogni personaggio che hai in gioco, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "COME VA?",
        description:
          "Quando giochi questo personaggio, puoi pescare una carta per ogni altro personaggio che hai in gioco, poi scegli e scarta altrettante carte.",
      },
    ],
  },
};
