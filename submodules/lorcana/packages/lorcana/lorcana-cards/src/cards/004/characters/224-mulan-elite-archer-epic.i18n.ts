import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mulanEliteArcherEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mulan",
    version: "Elite Archer",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "STRAIGHT SHOOTER",
        description:
          "When you play this character, if you used Shift to play her, she gets +3 {S} this turn.",
      },
      {
        title: "TRIPLE SHOT",
        description:
          "During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.",
      },
    ],
  },
  de: {
    name: "Mulan",
    version: "Elite-Bogenschützin",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Mulan-Charaktere auszuspielen.)",
      },
      {
        title: "Scharfschützin",
        description:
          "Falls du <Gestaltwandel> benutzt hast, um diesen Charakter auszuspielen, erhält er in diesem Zug +3 {S}.",
      },
      {
        title: "Dreifach-Schuss",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einem anderen Charakter Schaden zufügt, füge bis zu 2 anderen Charakteren deiner Wahl genauso viel Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Mulan",
    version: "Archère d'élite",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Mulan.)",
      },
      {
        title: "Tireuse d'élite",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité <Alter>, il gagne +3 {S} pour le reste de ce tour.",
      },
      {
        title: "Tir triple",
        description:
          "Chaque fois que ce personnage en défie un autre durant votre tour et lui inflige des dommages, choisissez jusqu'à 2 autres personnages et infligez à chacun autant de dommages.",
      },
    ],
  },
  it: {
    name: "Mulan",
    version: "Arciera d'Élite",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Mulan.)",
      },
      {
        title: "Tiratrice Precisa",
        description:
          "Quando giochi questo personaggio, se hai usato <Trasformazione> per giocarlo, riceve +3 {S} per questo turno.",
      },
      {
        title: "Triplo Bersaglio",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio infligge danno a un altro personaggio durante una sfida, infliggi lo stesso ammontare di danno a fino a 2 altri personaggi a tua scelta.",
      },
    ],
  },
  es: {
    name: "Mulán",
    version: "Arquero de élite",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "TIRADOR RECTO",
        description:
          "Cuando juegas con este personaje, si usaste Shift para interpretarlo, ella obtiene +3 {S} este turno.",
      },
      {
        title: "DISPARO TRIPLE",
        description:
          "Durante tu turno, siempre que este personaje inflija daño a otro personaje en un desafío, inflige la misma cantidad de daño hasta a otros 2 personajes elegidos.",
      },
    ],
  },
};
