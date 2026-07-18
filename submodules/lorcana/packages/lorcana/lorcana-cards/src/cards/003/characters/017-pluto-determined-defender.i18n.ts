import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plutoDeterminedDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pluto",
    version: "Determined Defender",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Bodyguard",
      },
      {
        title: "GUARD DOG",
        description: "At the start of your turn, remove up to 3 damage from this character.",
      },
    ],
  },
  de: {
    name: "Pluto",
    version: "Entschlossener Verteidiger",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Pluto-Charaktere auszuspielen.)",
      },
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Wachhund",
        description: "Zu Beginn deines Zuges, entferne bis zu 3 Schaden von diesem Charakter.",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Protecteur déterminé",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Pluto.)",
      },
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Chien de garde",
        description: "Au début de votre tour, retirez jusqu'à 3 jetons Dommage de ce personnage.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Guardia Risoluta",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Pluto.)",
      },
      {
        title: "<Guardiano>",
      },
      {
        title: "Cane da Guardia",
        description: "All'inizio del tuo turno, rimuovi fino a 3 danni da questo personaggio.",
      },
    ],
  },
  es: {
    name: "Plutón",
    version: "Defensor decidido",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Guardaespaldas",
      },
      {
        title: "perro guardián",
        description: "Al comienzo de tu turno, elimina hasta 3 daños de este personaje.",
      },
    ],
  },
};
