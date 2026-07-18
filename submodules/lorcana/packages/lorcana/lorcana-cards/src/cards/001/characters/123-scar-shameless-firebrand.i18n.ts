import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarShamelessFirebrandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scar",
    version: "Shameless Firebrand",
    text: [
      {
        title: "Shift 6",
      },
      {
        title: "ROUSING SPEECH",
        description:
          "When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Scar",
    version: "Schamloser Unruhestifter",
    text: "<Gestaltwandel> 6 (Du kannst 6 {I} zahlen, um diesen Charakter auf einen deiner Scar-Charaktere auszuspielen.)\\Mitreißende Ansprache\\ Wenn du diesen Charakter ausspielst, mache alle deine Charaktere, die 3 oder weniger kosten, bereit. Sie können in diesem Zug nicht mehr erkunden.",
  },
  fr: {
    name: "SCAR",
    version: "Fanatique sans scrupule",
    text: [
      {
        title:
          "<Alter> 6 (Vous pouvez payer 6 {I} pour jouer ce personnage sur l'un de vos personnages Scar.)",
      },
      {
        title: "DISCOURS ENFLAMMÉ",
        description:
          "Lorsque vous jouez ce personnage, redressez vos personnages coûtant 3 ou moins. Ils ne peuvent pas être envoyés à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Shameless Firebrand",
    text: [
      {
        title:
          "<Shift> 6 (You may pay 6 {I} to play this on top of one of your characters named Scar.)",
      },
      {
        title: "Rousing Speech",
        description:
          "When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn.",
      },
    ],
  },
  es: {
    name: "Cicatriz",
    version: "Tizón descarado",
    text: [
      {
        title: "Shift 6",
      },
      {
        title: "DISCURSO CONmovedor",
        description:
          "Cuando juegues con este personaje, prepara tus personajes con un coste de 3 o menos. No pueden realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
