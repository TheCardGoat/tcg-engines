import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gadgetHackwrenchResourcefulMechanicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gadget Hackwrench",
    version: "Resourceful Mechanic",
    text: [
      {
        title: "TIME TO TINKER",
        description:
          "When you play this character, you may play an item with cost 3 or less for free.",
      },
      {
        title: "WELL SUPPLIED",
        description: "Your characters with Support get +1 {L}.",
      },
    ],
  },
  de: {
    name: "Trixi",
    version: "Erfinderische Mechanikerin",
    text: [
      {
        title: "Zeit zum Schrauben",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Gegenstand, der 3 oder weniger kostet, kostenlos ausspielen.",
      },
      {
        title: "Gut versorgt",
        description: "Deine Charaktere mit <Unterstützen> erhalten +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Gadget",
    version: "Mécanicienne pleine de ressources",
    text: [
      {
        title: "Il est temps de bricoler",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez jouer gratuitement un objet coûtant 3 ou moins.",
      },
      {
        title: "Tout ce qu'il faut",
        description: "Vos personnages avec Soutien gagnent +1 {L}.",
      },
    ],
  },
  it: {
    name: "Scheggia Hackwrench",
    version: "Meccanica Piena di Risorse",
    text: [
      {
        title: "È Ora di Armeggiare",
        description:
          "Quando giochi questo personaggio, puoi giocare un oggetto con costo 3 o inferiore gratis.",
      },
      {
        title: "Ben Rifornita",
        description: "I tuoi personaggi con <Aiutante> ricevono +1 {L}.",
      },
    ],
  },
};
