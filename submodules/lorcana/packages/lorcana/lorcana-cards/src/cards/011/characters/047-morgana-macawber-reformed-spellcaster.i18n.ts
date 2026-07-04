import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const morganaMacawberReformedSpellcasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Morgana Macawber",
    version: "Reformed Spellcaster",
    text: [
      {
        title: "Shift 4 {I}",
      },
      {
        title: "JUST FOR YOU",
        description:
          "When you play this character, you may choose an opposing character and move 1 damage from each other character to them.",
      },
    ],
  },
  de: {
    name: "Morgana Makaber",
    version: "Reformierte Zauberkundige",
    text: [
      {
        title:
          "<Gestaltwandel> 4 {I} (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Morgana-Makaber-Charaktere auszuspielen.)",
      },
      {
        title: "Nur für dich",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du je 1 Schaden von jedem Charakter zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
    ],
  },
  fr: {
    name: "Morgana",
    version: "Ensorceleuse repentie",
    text: [
      {
        title:
          "<Alter> 4 {I} (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Morgana.)",
      },
      {
        title: "Rien que pour toi",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage adverse et déplacer 1 dommage de chaque autre personnage sur lui.",
      },
    ],
  },
  it: {
    name: "Morgana Macawber",
    version: "Incantatrice Ravveduta",
    text: [
      {
        title:
          "<Trasformazione> 4 {I} (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Morgana Macawber.)",
      },
      {
        title: "Solo Per Te",
        description:
          "Quando giochi questo personaggio, puoi scegliere un personaggio avversario e spostare 1 danno da ogni altro personaggio a esso.",
      },
    ],
  },
};
