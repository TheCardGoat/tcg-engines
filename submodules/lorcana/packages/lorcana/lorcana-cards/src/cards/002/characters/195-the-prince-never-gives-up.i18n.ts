import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thePrinceNeverGivesUpI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Prince",
    version: "Never Gives Up",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "Resist +1",
      },
    ],
  },
  de: {
    name: "Der Prinz",
    version: "Gibt niemals auf",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title:
          "<Robust> +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Le Prince",
    version: "N'abandonne jamais",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "<Résistance> +1",
      },
    ],
  },
  it: {
    name: "The Prince",
    version: "Never Gives Up",
    text: [
      {
        title:
          "<Bodyguard> (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
      {
        title: "<Resist> +1 (Damage dealt to this character is reduced by 1.)",
      },
    ],
  },
};
