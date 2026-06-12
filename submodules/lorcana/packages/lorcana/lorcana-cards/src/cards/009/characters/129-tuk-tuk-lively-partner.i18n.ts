import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tukTukLivelyPartnerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tuk Tuk",
    version: "Lively Partner",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "ON",
        description:
          "A ROLL When you play this character, you may move him and one of your other characters to the same location for free. If you do, the other character gets +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Tuktuk",
    version: "Lebendiger Verbündeter",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "AUFGEDREHT",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du ihn und einen deiner anderen Charaktere kostenlos zu dem selben Ort bewegen. Der andere Charakter erhält in diesem Zug +2.",
      },
    ],
  },
  fr: {
    name: "Tuk Tuk",
    version: "Partenaire percutant",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "ÇA ROULE",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un autre personnage et les déplacer tous les deux gratuitement sur un même lieu. Le personnage choisi gagne +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tuk Tuk",
    version: "Compagno Vivace",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "ROTOLAMENTO",
        description:
          "Quando giochi questo personaggio, puoi spostare lui e uno dei tuoi altri personaggi in uno stesso luogo, gratis. L'altro personaggio riceve +2 per questo turno.",
      },
    ],
  },
};
