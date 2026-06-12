import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sleepySluggishKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sleepy",
    version: "Sluggish Knight",
    text: "Bodyguard",
  },
  de: {
    name: "Schlafmütz",
    version: "Ritter der Müdigkeit",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Dormeur",
    version: "Chevalier amorphe",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Pisolo",
    version: "Cavaliere Sonnolento",
    text: "Guardiano",
  },
};
