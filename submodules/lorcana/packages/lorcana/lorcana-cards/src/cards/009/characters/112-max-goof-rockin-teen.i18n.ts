import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maxGoofRockinTeenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Max Goof",
    version: "Rockin' Teen",
    text: [
      {
        title: "Singer 5",
      },
      {
        title: "I JUST WANNA STAY HOME",
        description: "This character can't move to locations.",
      },
    ],
  },
  de: {
    name: "Max Goof",
    version: "Rockiger Teenie",
    text: [
      {
        title: "<Singen> 5 (Die Kosten dieses Charakters gelten als 5 für das Singen von Liedern.)",
      },
      {
        title: "Ich möchte einfach zu Hause bleiben",
        description: "Dieser Charakter kann nicht zu Orten bewegt werden.",
      },
    ],
  },
  fr: {
    name: "Max Dingo",
    version: "Ado qui rock",
    text: [
      {
        title:
          "<Mélomane> 5 (Ce personnage est considéré comme ayant un coût de 5 pour chanter des chansons.)",
      },
      {
        title: "Je veux juste rester à la maison",
        description: "Ce personnage ne peut pas être déplacé sur un lieu.",
      },
    ],
  },
  it: {
    name: "Max Pippo",
    version: "Adolescente che Spacca",
    text: [
      {
        title: "<Melodioso> 5",
      },
      {
        title: "Voglio Solo Restare a Casa",
        description: "Questo personaggio non può spostarsi nei luoghi.",
      },
    ],
  },
  es: {
    name: "Tonto máximo",
    version: "Adolescente rockero",
    text: [
      {
        title: "Cantante 5",
      },
      {
        title: "SOLO QUIERO QUEDARME EN CASA",
        description: "Este personaje no puede moverse a lugares.",
      },
    ],
  },
};
