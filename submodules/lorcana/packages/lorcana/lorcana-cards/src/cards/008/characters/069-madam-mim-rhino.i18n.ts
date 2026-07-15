import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madamMimRhinoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Madam Mim",
    version: "Rhino",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "MAKE WAY, COMING THROUGH!",
        description:
          "When you play this character, banish her or return another chosen character of yours to your hand.",
      },
    ],
  },
  de: {
    name: "Madame Mim",
    version: "Nashorn",
    text: [
      {
        title:
          "<Gestaltwandel> 2 (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Madame-Mim-Charaktere auszuspielen.)",
      },
      {
        title: "Aus dem Weg, ich komme!",
        description:
          "Wenn du diesen Charakter ausspielst, musst du ihn verbannen oder einen deiner anderen Charaktere wählen und zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Madame Mime",
    version: "En rhinocéros",
    text: [
      {
        title:
          "<Alter> 2 (Vous pouvez payer 2 {I} pour jouer ce personnage sur l'un de vos personnages Madame Mime.)",
      },
      {
        title: "Faites place, je passe!",
        description:
          "Lorsque vous jouez ce personnage, bannissez-le ou renvoyez l'un de vos autres personnages en jeu dans votre main.",
      },
    ],
  },
  it: {
    name: "Maga Magò",
    version: "Rinoceronte",
    text: [
      {
        title:
          "<Trasformazione> 2 (Puoi pagare 2 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Maga Magò.)",
      },
      {
        title: "Fate Largo, Arrivo!",
        description:
          "Quando giochi questo personaggio, esilialo o riprendi in mano un tuo altro personaggio a tua scelta.",
      },
    ],
  },
};
