import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const puaProtectivePigI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pua",
    version: "Protective Pig",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "FREE FRUIT",
        description: "When this character is banished, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Pua",
    version: "Beschützendes Schwein",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Gratis Obst",
        description: "Wenn dieser Charakter verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Pua",
    version: "Cochon protecteur",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Fruits gratuits",
        description: "Lorsque ce personnage est banni, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Pua",
    version: "Maiale Protettivo",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Frutta Gratis",
        description: "Quando questo personaggio viene esiliato, puoi pescare una carta.",
      },
    ],
  },
  es: {
    name: "Puá",
    version: "Cerdo protector",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "FRUTA GRATIS",
        description: "Cuando este personaje es desterrado, puedes robar una carta.",
      },
    ],
  },
};
