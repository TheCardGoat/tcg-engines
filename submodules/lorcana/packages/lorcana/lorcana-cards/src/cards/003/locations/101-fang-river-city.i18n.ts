import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fangRiverCityI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fang",
    version: "River City",
    text: [
      {
        title: "SURROUNDED BY WATER",
        description:
          "Characters gain Ward and Evasive while here. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
      },
    ],
  },
  de: {
    name: "Zahn",
    version: "Stadt am Fluss",
    text: [
      {
        title: "Von Wasser umgeben",
        description:
          "Charaktere an diesem Ort erhalten <Behütet> und <Wendig>. (Gegnerische Karten können die Charaktere nicht auswählen, außer um sie herauszufordern. Nur Charaktere mit Wendig können diese Charaktere herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Croc du Dragon",
    version: "Cité des rivières",
    text: [
      {
        title: "Encerclé par les eaux",
        description:
          "Les personnages sur ce lieu gagnent <Hors d'atteinte> et <Insaisissable>. (Les adversaires ne peuvent pas choisir ces personnages, hormis pour un défi. Seuls les personnages avec Insaisissable peuvent défier ces personnages.)",
      },
    ],
  },
  it: {
    name: "Zanna",
    version: "Città sul Fiume",
    text: [
      {
        title: "Circondata dall'Acqua",
        description:
          "I personaggi ottengono <Protetto> e <Sfuggente> mentre si trovano in questo luogo. (Gli avversari non possono sceglierli se non per sfidarli. Solo altri personaggi con Sfuggente possono sfidarli.)",
      },
    ],
  },
  es: {
    name: "Colmillo",
    version: "Ciudad del río",
    text: [
      {
        title: "RODEADO DE AGUA",
        description:
          "Los personajes obtienen protección y evasión mientras están aquí. (Los oponentes no pueden elegirlos excepto para desafiarlos. Solo los personajes con Evasivo pueden desafiarlos).",
      },
    ],
  },
};
