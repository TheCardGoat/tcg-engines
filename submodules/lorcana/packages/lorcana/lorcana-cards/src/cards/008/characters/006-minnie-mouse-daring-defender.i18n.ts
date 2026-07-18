import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseDaringDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Daring Defender",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "TRUE VALOR",
        description: "This character gets +1 {S} for each 1 damage on her.",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Wagemutige Beschützerin",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Wahre Tapferkeit",
        description: "Dieser Charakter erhält +1 {S} für jeden Schaden auf ihm.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Défenseuse hardie",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Bravoure véritable",
        description: "Ce personnage gagne +1 {S} pour chaque dommage sur lui.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Difenditrice Coraggiosa",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Vero Valore",
        description: "Questo personaggio riceve +1 {S} per ogni singolo danno su di esso.",
      },
    ],
  },
  es: {
    name: "Minnie ratón",
    version: "Defensor atrevido",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "VERDADERO VALOR",
        description: "Este personaje obtiene +1 {S} por cada daño que sufre.",
      },
    ],
  },
};
