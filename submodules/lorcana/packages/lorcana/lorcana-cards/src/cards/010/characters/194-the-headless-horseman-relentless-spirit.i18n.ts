import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theHeadlessHorsemanRelentlessSpiritI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Headless Horseman",
    version: "Relentless Spirit",
    text: "Bodyguard",
  },
  de: {
    name: "Der kopflose Reiter",
    version: "Unbarmherziger Geist",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Le Cavalier sans tête",
    version: "Esprit implacable",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Il Cavaliere Senza Testa",
    version: "Spirito Implacabile",
    text: "Guardiano",
  },
};
