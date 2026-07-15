import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeEricUrsulasGroomI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince Eric",
    version: "Ursula's Groom",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "UNDER VANESSA'S SPELL",
        description:
          "While you have a character named Ursula in play, this character gains Bodyguard and gets +2 {W}. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
    ],
  },
  de: {
    name: "Prinz Eric",
    version: "Ursulas Bräutigam",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Prinz-Eric-Charaktere auszuspielen.)",
      },
      {
        title: "In Vanessas Bann",
        description:
          "Solange du mindestens einen Ursula-Charakter im Spiel hast, erhält dieser Charakter +2 {W} und <Beschützen>. (Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Prince Eric",
    version: "Fiancé d'Ursula",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Prince Eric.)",
      },
      {
        title: "Sous le charme de Vanessa",
        description:
          "Tant que vous avez un personnage Ursula en jeu, ce personnage-ci gagne <Rempart> et +2 {W}. (Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Principe Eric",
    version: "Sposo di Ursula",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Principe Eric.)",
      },
      {
        title: "Sotto l'Incanto di Vanessa",
        description:
          "Mentre hai in gioco un personaggio chiamato Ursula, questo personaggio ottiene <Guardiano> e riceve +2 {W}. (Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile.)",
      },
    ],
  },
};
