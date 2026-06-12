import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gwythaintSavageHunterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gwythaint",
    version: "Savage Hunter",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "SWOOPING STRIKE",
        description:
          "Whenever this character quests, each opponent chooses and exerts one of their ready characters.",
      },
    ],
  },
  de: {
    name: "Der Drache",
    version: "Wilder Jäger",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "STURZFLUGANGRIFF",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wählen alle gegnerischen Mitspielenden je einen ihrer bereiten Charaktere und erschöpfen ihn.",
      },
    ],
  },
  fr: {
    name: "Vouivre",
    version: "Chasseur sauvage",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "ATTAQUE EN PIQUÉ",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, chaque adversaire choisit l'un de ses personnages redressés et l'épuise.",
      },
    ],
  },
  it: {
    name: "Gwythaint",
    version: "Cacciatore Selvaggio",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "ATTACCO IN PICCHIATA",
        description:
          "Ogni volta che questo personaggio va all'avventura, ogni avversario sceglie e impegna uno dei suoi personaggi preparati.",
      },
    ],
  },
};
