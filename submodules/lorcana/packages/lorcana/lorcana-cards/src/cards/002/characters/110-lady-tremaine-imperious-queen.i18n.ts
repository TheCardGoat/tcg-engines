import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ladyTremaineImperiousQueenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lady Tremaine",
    version: "Imperious Queen",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "POWER TO RULE AT LAST",
        description:
          "When you play this character, each opponent chooses and banishes one of their characters.",
      },
    ],
  },
  de: {
    name: "Gräfin Tremaine",
    version: "Gebieterische Königin",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Gräfin-Tremaine-Charaktere auszuspielen.)",
      },
      {
        title: "Endlich an der Macht",
        description:
          "Wenn du diesen Charakter ausspielst, wählen alle gegnerischen Mitspielenden je einen ihrer Charaktere und verbannen ihn.",
      },
    ],
  },
  fr: {
    name: "Madame de Trémaine",
    version: "Reine impérieuse",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Madame de Trémaine.)",
      },
      {
        title: "Enfin, le pouvoir de régner",
        description:
          "Lorsque vous jouez ce personnage, chaque adversaire choisit l'un de ses personnages et le bannit.",
      },
    ],
  },
  it: {
    name: "Lady Tremaine",
    version: "Imperious Queen",
    text: [
      {
        title:
          "<Shift> 4 (You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)",
      },
      {
        title: "Power to Rule at Last",
        description:
          "When you play this character, each opponent chooses and banishes one of their characters.",
      },
    ],
  },
};
