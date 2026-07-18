import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesDivineHeroEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "Divine Hero",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "Resist +2",
      },
    ],
  },
  de: {
    name: "Hercules",
    version: "Göttlicher Held",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Hercules-Charaktere auszuspielen.)",
      },
      {
        title:
          "<Robust> +2 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Hercule",
    version: "Héros divin",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Hercule.)",
      },
      {
        title: "<Résistance> +2",
      },
    ],
  },
  it: {
    name: "Hercules",
    version: "Divine Hero",
    text: [
      {
        title:
          "<Shift> 4 (You may pay 4 {I} to play this on top of one of your characters named Hercules.)",
      },
      {
        title: "<Resist> +2 (Damage dealt to this character is reduced by 2.)",
      },
    ],
  },
  es: {
    name: "Hércules",
    version: "Héroe Divino",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "Resistir +2",
      },
    ],
  },
};
