import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gastonIntellectualPowerhouseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gaston",
    version: "Intellectual Powerhouse",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "DEVELOPED BRAIN",
        description:
          "When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Gaston",
    version: "Intellektuelles Kraftpaket",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Gaston-Charaktere auszuspielen.)",
      },
      {
        title: "Entwickeltes Gehirn",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du dir die obersten 3 Karten deines Decks anschauen. Du darfst 1 davon auf deine Hand nehmen. Lege den Rest in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Gaston",
    version: "Fort du cerveau",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Gaston.)",
      },
      {
        title: "Esprit développé",
        description:
          "Lorsque vous jouez ce personnage, regardez les 3 premières cartes de votre pioche, vous pouvez ajouter l'une d'elles à votre main. Remettez le reste sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Gaston",
    version: "Concentrato di Intelligenza",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Gaston.)",
      },
      {
        title: "Cervello Sviluppato",
        description:
          "Quando giochi questo personaggio, guarda le prime 3 carte del tuo mazzo. Puoi aggiungerne una alla tua mano. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
