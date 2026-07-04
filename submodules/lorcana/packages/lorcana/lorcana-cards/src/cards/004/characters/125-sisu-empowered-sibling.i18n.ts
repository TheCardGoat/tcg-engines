import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sisuEmpoweredSiblingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sisu",
    version: "Empowered Sibling",
    text: [
      {
        title: "Shift 6",
      },
      {
        title: "I GOT THIS!",
        description:
          "When you play this character, banish all opposing characters with 2 {S} or less.",
      },
    ],
  },
  de: {
    name: "Sisu",
    version: "Starkes Familienmitglied",
    text: [
      {
        title:
          "<Gestaltwandel> 6 (Du kannst 6 {I} zahlen, um diesen Charakter auf einen deiner Sisu-Charaktere auszuspielen.)",
      },
      {
        title: "Ich mach das schon!",
        description:
          "Wenn du diesen Charakter ausspielst, verbanne alle gegnerischen Charaktere mit 2 oder weniger {S}.",
      },
    ],
  },
  fr: {
    name: "Sisu",
    version: "Sœur responsable",
    text: [
      {
        title:
          "<Alter> 6 (Vous pouvez payer 6 {I} pour jouer ce personnage sur l'un de vos personnages Sisu.)",
      },
      {
        title: "Laisse-moi gérer ça!",
        description:
          "Lorsque vous jouez ce personnage, bannissez tous les personnages adverses ayant 2 {S} ou moins.",
      },
    ],
  },
  it: {
    name: "Sisu",
    version: "Sorella Potenziata",
    text: [
      {
        title:
          "<Trasformazione> 6 (Puoi pagare 6 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Sisu.)",
      },
      {
        title: "Lascia Fare a Me",
        description:
          "Quando giochi questo personaggio, esilia tutti i personaggi avversari con 2 {S} o inferiore.",
      },
    ],
  },
};
