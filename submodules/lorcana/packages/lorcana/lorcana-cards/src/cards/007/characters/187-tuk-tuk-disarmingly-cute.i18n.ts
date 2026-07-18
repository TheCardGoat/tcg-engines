import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tukTukDisarminglyCuteI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tuk Tuk",
    version: "Disarmingly Cute",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "Resist +2",
      },
    ],
  },
  de: {
    name: "Tuktuk",
    version: "Entwaffnend niedlich",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title:
          "<Robust> +2 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Tuk Tuk",
    version: "Irrésistiblement mignon",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "<Résistance> +2",
      },
    ],
  },
  it: {
    name: "Tuk Tuk",
    version: "Bello e Disarmante",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "<Resistere> +2",
      },
    ],
  },
  es: {
    name: "Tuk-tuk",
    version: "Desarmantemente lindo",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "Resistir +2",
      },
    ],
  },
};
