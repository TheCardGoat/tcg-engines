import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const balooFriendAndGuardianI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Baloo",
    version: "Friend and Guardian",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "Support",
      },
    ],
  },
  de: {
    name: "Balu",
    version: "Freund und Beschützer",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Baloo",
    version: "Ami et gardien",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Baloo",
    version: "Amico e Guardiano",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
  es: {
    name: "Baloo",
    version: "Amigo y guardián",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "Apoyo",
      },
    ],
  },
};
