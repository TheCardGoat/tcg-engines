import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const owlIslandSecludedEntranceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Owl Island",
    version: "Secluded Entrance",
    text: [
      {
        title: "TEAMWORK",
        description:
          "For each character you have here, you pay 1 {I} less for the first action you play each turn.",
      },
      {
        title: "LOTS TO LEARN",
        description: "Whenever you play a second action in a turn, gain 3 lore.",
      },
    ],
  },
  de: {
    name: "Insel der Eule",
    version: "Abgelegener Eingang",
    text: [
      {
        title: "TEAMARBEIT",
        description:
          "Für jeden deiner Charaktere an diesem Ort zahlst du 1 weniger für die erste Aktion, die du in jedem Zug ausspielst.",
      },
      {
        title: "VIEL ZU LERNEN",
        description:
          "Jedes Mal, wenn du in einem Zug die zweite Aktion ausspielst, sammelst du 3 Legenden.",
      },
    ],
  },
  fr: {
    name: "Île de la Chouette",
    version: "Entrée isolée",
    text: [
      {
        title: "TRAVAIL D'ÉQUIPE",
        description:
          "Pour chaque personnage sur ce lieu, la première action que vous jouez chaque tour vous coûte 1 de moins.",
      },
      {
        title: "BEAUCOUP À APPRENDRE",
        description:
          "Chaque fois que vous jouez la deuxième action de votre tour, gagnez 3 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Isola del Gufo",
    version: "Ingresso Nascosto",
    text: [
      {
        title: "LAVORO DI SQUADRA",
        description:
          "Per ogni personaggio che hai in questo luogo, paga 1 in meno per giocare la tua prima azione ogni turno.",
      },
      {
        title: "MOLTO DA IMPARARE",
        description: "Ogni volta che giochi una seconda azione in un turno, ottieni 3 leggenda.",
      },
    ],
  },
};
