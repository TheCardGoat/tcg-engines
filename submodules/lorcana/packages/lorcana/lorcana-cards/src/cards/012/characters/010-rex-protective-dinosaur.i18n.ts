import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rexProtectiveDinosaurI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rex",
    version: "Protective Dinosaur",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "RUN AWAY!",
        description: "During an opponent's turn, when this character is banished, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Rex",
    version: "Beschützender Dinosaurier",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Lauft weg!",
        description:
          "Wenn dieser Charakter im Zug einer gegnerischen Person verbannt wird, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Rex",
    version: "Dinosaure protecteur",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Fuyez!",
        description:
          "Durant le tour de vos adversaires, lorsque ce personnage est banni, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Rex",
    version: "Dinosauro Protettivo",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Scappate!",
        description:
          "Durante il turno di un avversario, quando questo personaggio viene esiliato, ottieni 1 leggenda.",
      },
    ],
  },
  es: {
    name: "Rex",
    version: "Dinosaurio protector",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "¡HUIR!",
        description:
          "Durante el turno de un oponente, cuando este personaje es desterrado, gana 1 conocimiento.",
      },
    ],
  },
};
