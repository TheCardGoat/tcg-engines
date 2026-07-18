import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const littleJohnResourcefulOutlawI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Little John",
    version: "Resourceful Outlaw",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "OKAY, BIG SHOT",
        description:
          "While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}.",
      },
    ],
  },
  de: {
    name: "Little John",
    version: "Raffinierter Gesetzloser",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Little-John-Charaktere auszuspielen.)",
      },
      {
        title: "Dein Glück, du Knilch",
        description:
          "Solange dieser Charakter erschöpft ist, erhalten deine Charaktere mit <Beschützen> +1 {L} und <Robust> +1 (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Petit Jean",
    version: "Hors-la-loi plein de ressources",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Petit Jean.)",
      },
      {
        title: "C'est ça, grand chef",
        description:
          "Tant que ce personnage est épuisé, vos personnages avec <Rempart> gagnent +1 {L} et <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Little John",
    version: "Fuorilegge Intraprendente",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Little John.)",
      },
      {
        title: "OK, Buffone",
        description:
          "Mentre questo personaggio è impegnato, i tuoi personaggi con <Guardiano> ottengono <Resistere> +1 e ricevono +1 {L}.",
      },
    ],
  },
  es: {
    name: "Pequeño juan",
    version: "Forajido ingenioso",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "Está bien, pez gordo",
        description:
          "Mientras este personaje está ejercido, tus personajes con Bodyguard obtienen Resistencia +1 y obtienen +1 {L}.",
      },
    ],
  },
};
