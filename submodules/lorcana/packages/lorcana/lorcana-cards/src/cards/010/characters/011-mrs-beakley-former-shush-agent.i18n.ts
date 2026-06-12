import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mrsBeakleyFormerShushAgentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mrs. Beakley",
    version: "Former S.H.U.S.H. Agent",
    text: "Bodyguard",
  },
  de: {
    name: "Frieda",
    version: "Ehemalige S.H.U.S.H.-Agentin",
    text: "Beschützen (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "Mamie Baba",
    version: "Ancienne agente du C.H.U.T.",
    text: [
      {
        title: "Rempart",
        description:
          "(Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Tata",
    version: "Ex Agente dello S.H.U.S.H.",
    text: "Guardiano",
  },
};
