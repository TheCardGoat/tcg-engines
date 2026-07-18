import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSmithUndauntedProtectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Smith",
    version: "Undaunted Protector",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "DO YOUR WORST",
        description: "Opponents must choose this character for actions and abilities if able.",
      },
    ],
  },
  de: {
    name: "John Smith",
    version: "Unerschrockener Beschützer",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Tu, was du nicht lassen kannst",
        description:
          "Gegnerische Mitspielende müssen mit ihren Aktionen und Fähigkeiten diesen Charakter auswählen, wenn möglich.",
      },
    ],
  },
  fr: {
    name: "John Smith",
    version: "Protecteur impavide",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Tente ta chance",
        description:
          "Les adversaires doivent, s'ils le peuvent, choisir ce personnage avec toute action ou capacité.",
      },
    ],
  },
  it: {
    name: "John Smith",
    version: "Protettore Indomito",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Fai del Tuo Peggio",
        description:
          "Gli avversari devono scegliere questo personaggio per azioni e abilità, se possibile.",
      },
    ],
  },
  es: {
    name: "Juan Smith",
    version: "Protector impávido",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "HAGA LO PEOR",
        description:
          "Los oponentes deben elegir este personaje para acciones y habilidades si pueden.",
      },
    ],
  },
};
