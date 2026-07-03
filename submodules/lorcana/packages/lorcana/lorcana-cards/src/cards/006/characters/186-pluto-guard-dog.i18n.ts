import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plutoGuardDogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pluto",
    version: "Guard Dog",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "BRAVO",
        description: "While this character has no damage, he gets +4 {S}.",
      },
    ],
  },
  de: {
    name: "Pluto",
    version: "Wachhund",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Guter Junge",
        description: "Solange dieser Charakter unbeschädigt ist, erhält er +4 {S}.",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Chien de garde",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Bon chien",
        description: "Tant que ce personnage n'a aucun dommage sur lui, il gagne +4 {S}.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Cane da Guardia",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Bravo",
        description: "Mentre questo personaggio non ha danno, riceve +4 {S}.",
      },
    ],
  },
};
