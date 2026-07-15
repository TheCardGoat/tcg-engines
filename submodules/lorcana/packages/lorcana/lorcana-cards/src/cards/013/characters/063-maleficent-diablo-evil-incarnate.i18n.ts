import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maleficentDiabloEvilIncarnateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maleficent & Diablo",
    version: "Evil Incarnate",
    text: [
      {
        title: "<Shift> 5 {I}",
      },
      {
        title: "Fools!",
        description:
          "You may put 5 character cards from your discard on the bottom of your deck in any order to shift this character for free.",
      },
      {
        title: "Raven's Call",
        description: "During your turn, whenever this character exerts, draw a card.",
      },
    ],
  },
  de: {
    name: "Malefiz & Diablo",
    version: "Das Böse in Person",
    text: [
      {
        title:
          "<Gestaltwandel> 5 {I} (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Malefiz oder Diablo auszuspielen.)",
      },
      {
        title: "Narren!",
        description:
          "Du kannst 5 Charakterkarten von deinem Ablagestapel in beliebiger Reihenfolge unter dein Deck legen, um diesen Charakter kostenlos zu gestaltwandeln.",
      },
      {
        title: "Der Ruf des Raben",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug erschöpft wird, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Maléfique & Diablo",
    version: "Le mal incarné",
    text: [
      {
        title: "<Alter> 5 {I}",
      },
      {
        title: "Crétins!",
        description:
          "Vous pouvez placer 5 cartes Personnage de votre défausse sous votre pioche, dans l'ordre de votre choix, pour jouer ce personnage gratuitement via sa capacité Alter.",
      },
      {
        title: "Appel du corbeau",
        description:
          "Durant votre tour, chaque fois que ce personnage est épuisé, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Malefica e Diablo",
    version: "Incarnazione del Male",
    text: [
      {
        title:
          "<Trasformazione> 5 {I} (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Malefica o Diablo.)",
      },
      {
        title: "Idioti!",
        description:
          "Puoi mettere 5 carte personaggio dai tuoi scarti in fondo al tuo mazzo in qualsiasi ordine per trasformare questo personaggio gratis.",
      },
      {
        title: "Richiamo del Corvo",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio viene impegnato, pesca una carta.",
      },
    ],
  },
};
