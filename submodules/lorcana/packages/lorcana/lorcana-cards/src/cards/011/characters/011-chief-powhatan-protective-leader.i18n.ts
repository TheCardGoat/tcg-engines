import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chiefPowhatanProtectiveLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chief Powhatan",
    version: "Protective Leader",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "STANDS HIS GROUND",
        description: "This character can't challenge.",
      },
    ],
  },
  de: {
    name: "Häuptling Powhatan",
    version: "Beschützender Anführer",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Steht seinen Mann",
        description: "Dieser Charakter kann nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Powhatan",
    version: "Chef protecteur",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Tient sa position",
        description: "Ce personnage ne peut pas défier.",
      },
    ],
  },
  it: {
    name: "Capo Powhatan",
    version: "Leader Protettivo",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Mantenere la Posizione",
        description: "Questo personaggio non può sfidare.",
      },
    ],
  },
  es: {
    name: "Jefe Powhatan",
    version: "Líder protector",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "SE MANTIENE EN SU TERRENO",
        description: "Este personaje no puede desafiar.",
      },
    ],
  },
};
