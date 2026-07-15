import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const clawhauserFrontDeskOfficerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Clawhauser",
    version: "Front Desk Officer",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "Singer 4",
      },
    ],
  },
  de: {
    name: "Clawhauser",
    version: "Empfangsoffizier",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "<Singen> 4 (Die Kosten dieses Charakters gelten als 4 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Clawhauser",
    version: "Agent d'accueil",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title:
          "<Mélomane> 4 (Ce personnage est considéré comme ayant un coût de 4 pour chanter des chansons.)",
      },
    ],
  },
  it: {
    name: "Clawhauser",
    version: "Ufficiale dell'Accettazione",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "<Melodioso> 4",
      },
    ],
  },
};
