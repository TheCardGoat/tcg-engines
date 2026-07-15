import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mushuYourWorstNightmareEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mushu",
    version: "Your Worst Nightmare",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "ALL FIRED UP",
        description:
          "Whenever you play another character, they gain Rush, Reckless, and Evasive this turn. (They can challenge the turn they're played. They can't quest and must challenge if able. They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Mushu",
    version: "Dein schlimmster Albtraum",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Mushu-Charaktere auszuspielen.)",
      },
      {
        title: "Voller Tatendrang",
        description:
          "Jedes Mal, wenn du einen anderen Charakter ausspielst, erhält jener in diesem Zug <Rasant>, <Impulsiv> und <Wendig>. (Er kann im selben Zug herausfordern, in dem er ausgespielt wird. Er kann nicht erkunden und muss herausfordern, wenn möglich. Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Mushu",
    version: "Ton pire cauchemar",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Mushu.)",
      },
      {
        title: "Pète le feu",
        description:
          "Chaque fois que vous jouez un autre personnage, il gagne <Charge>, <Combattant> et <Insaisissable> pour le reste de ce tour. (Ce personnage peut défier le tour où il est joué. Il ne peut pas être envoyé à l'aventure et doit défier s'il le peut. Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Mushu",
    version: "Il Vostro Peggiore Incubo",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Mushu.)",
      },
      {
        title: "Crepitante",
        description:
          "Ogni volta che giochi un altro personaggio, quel personaggio ottiene <Lesto>, <Attaccabrighe> e <Sfuggente> per questo turno. (Può sfidare nel turno in cui viene giocato. Non può andare all'avventura e deve sfidare, se possibile. Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
