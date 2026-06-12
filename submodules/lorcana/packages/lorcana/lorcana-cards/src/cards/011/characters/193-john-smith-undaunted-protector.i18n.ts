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
        title: "Beschützen",
      },
      {
        title: "TU, WAS DU NICHT LASSEN KANNST",
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
        title: "Rempart",
      },
      {
        title: "TENTE TA CHANCE",
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
        title: "Guardiano",
      },
      {
        title: "FAI DEL TUO PEGGIO",
        description:
          "Gli avversari devono scegliere questo personaggio per azioni e abilità, se possibile.",
      },
    ],
  },
};
