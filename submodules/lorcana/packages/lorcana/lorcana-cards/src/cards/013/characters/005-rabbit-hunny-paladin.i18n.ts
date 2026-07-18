import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rabbitHunnyPaladinI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rabbit",
    version: "Hunny Paladin",
    text: [
      {
        title: "Bodyguard",
        description: "(This character may enter play exerted.",
      },
      {
        title:
          "An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
      {
        title: "HUNNY AURA",
        description: "When you play this character,",
      },
      {
        title: "chosen Hunny character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Rabbit",
    version: "Honig-Paladin",
    text: "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.) Honig-Aura Wenn du diesen Charakter ausspielst, erhält ein Honig-Charakter deiner Wahl in diesem Zug +1 {L}.",
  },
  fr: {
    name: "Coco Lapin",
    version: "Paladin mellifique",
    text: "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.) Aura mellifique Lorsque vous jouez ce personnage, choisissez un personnage Miel qui gagne +1 {L} pour le reste de ce tour.",
  },
  it: {
    name: "Tappo",
    version: "Paladino del Miele",
    text: "<Guardiano> Aura Mielosa Quando giochi questo personaggio, un personaggio Miele a tua scelta riceve +1 {L} per questo turno.",
  },
  es: {
    name: "Conejo",
    version: "Paladín cariñoso",
    text: [
      {
        title: "Guardaespaldas",
        description: "(Este personaje puede entrar en juego agotado.",
      },
      {
        title:
          "Un personaje contrario que desafíe a uno de tus personajes debe elegir uno con Bodyguard si es posible.)",
      },
      {
        title: "AURA DE CARIÑO",
        description: "Cuando interpretas a este personaje,",
      },
      {
        title: "El personaje Hunny elegido obtiene +1 {L} este turno.",
      },
    ],
  },
};
