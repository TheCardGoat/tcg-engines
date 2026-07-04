import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinIntellectualVisionaryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Intellectual Visionary",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "OVERDEVELOPED BRAIN",
        description:
          "When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Intellektueller Visionär",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Merlin-Charaktere auszuspielen.)",
      },
      {
        title: "Überentwickeltes Gehirn",
        description:
          "Wenn du diesen Charakter ausspielst, falls du <Gestaltwandel> benutzt hast, um diesen Charakter auszuspielen, darfst du dein Deck nach einer beliebigen Karte durchsuchen und diese auf deine Hand nehmen. Mische danach dein Deck.",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "Visionnaire éclairé",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Merlin.)",
      },
      {
        title: "Cerveau surdéveloppé",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité <Alter>, vous pouvez chercher une carte dans votre pioche et la placer dans votre main. Ensuite, mélangez votre pioche.",
      },
    ],
  },
  it: {
    name: "Merlino",
    version: "Intellettuale Visionario",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Merlino.)",
      },
      {
        title: "Intelligenza Supersviluppata",
        description:
          "Quando giochi questo personaggio, se hai usato <Trasformazione> per giocarlo, puoi cercare una qualsiasi carta nel tuo mazzo, aggiungere quella carta alla tua mano e poi rimescolare il tuo mazzo.",
      },
    ],
  },
};
