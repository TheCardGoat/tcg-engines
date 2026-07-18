import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseMusketeerChampionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Musketeer Champion",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "DRAMATIC ENTRANCE",
        description:
          "When you play this character, banish chosen opposing character with 5 {S} or more.",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Musketier-Champion",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Spektakulärer Auftritt",
        description:
          "Wenn du diesen Charakter ausspielst, verbanne einen gegnerischen Charakter deiner Wahl mit 5 oder mehr {S}.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Championne Mousquetaire",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Entrée théatrale",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse avec 5 {S} ou plus et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Paladina dei Moschettieri",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Entrata Drammatica",
        description:
          "Quando giochi questo personaggio, esilia un personaggio avversario a tua scelta con 5 {S} o superiore.",
      },
    ],
  },
  es: {
    name: "Minnie ratón",
    version: "Campeón mosquetero",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "ENTRADA DRAMÁTICA",
        description:
          "Cuando juegues con este personaje, destierra al personaje contrario elegido con 5 {S} o más.",
      },
    ],
  },
};
