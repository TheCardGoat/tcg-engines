import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const omnidroidV9I18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Omnidroid",
    version: "V.9",
    text: [
      {
        title: "Shift 2 {I}",
      },
      {
        title: "ENEMY DETECTED",
        description:
          "When you play this character, if you used Shift to play it, you may deal 2 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Omnidroid",
    version: "V.9",
    text: [
      {
        title:
          "<Gestaltwandel> 2 {I} (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Omnidroid-Charaktere auszuspielen.)",
      },
      {
        title: "Feind entdeckt",
        description:
          "Wenn du diesen Charakter mithilfe von <Gestaltwandel> ausspielst, darfst du einem Charakter deiner Wahl 2 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Omnidroïde",
    version: "V.9",
    text: [
      {
        title:
          "<Alter> 2 {I} (Vous pouvez payer 2 {I} pour jouer ce personnage sur l'un de vos personnages nommé Omnidroïde.)",
      },
      {
        title: "Ennemi détecté",
        description:
          "Lorsque vous jouez ce personnage via sa capacité <Alter>, vous pouvez choisir un personnage et lui infliger 2 dommages.",
      },
    ],
  },
  it: {
    name: "Omnidroide",
    version: "V.9",
    text: [
      {
        title:
          "<Trasformazione> 2 {I} (Puoi pagare 2 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Omnidroide.)",
      },
      {
        title: "Nemico Individuato",
        description:
          "Quando giochi questo personaggio, se hai usato <Trasformazione> per giocarlo, puoi infliggere 2 danni a un personaggio a tua scelta.",
      },
    ],
  },
};
