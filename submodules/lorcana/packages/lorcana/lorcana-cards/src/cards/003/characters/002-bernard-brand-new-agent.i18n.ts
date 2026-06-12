import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bernardBrandnewAgentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bernard",
    version: "Brand-New Agent",
    text: [
      {
        title: "I'LL CHECK IT OUT",
        description:
          "At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
      },
    ],
  },
  de: {
    name: "Bernard",
    version: "Frischgebackener Agent",
    text: [
      {
        title: "ICH SCHAU MICH MAL EIN BISSCHEN UM",
        description:
          "Am Ende deines Zuges, wenn dieser Charakter erschöpft ist, darfst du einen deiner anderen Charaktere wählen und bereit machen.",
      },
    ],
  },
  fr: {
    name: "Bernard",
    version: "Tout nouvel agent",
    text: [
      {
        title: "JE VAIS VOIR CE QU'IL EN EST À",
        description:
          "la fin de votre tour, si ce personnage est épuisé, vous pouvez choisir et redresser l'un de vos autres personnages.",
      },
    ],
  },
  it: {
    name: "Bernie",
    version: "Agente Novello",
    text: [
      {
        title: "VADO A ISPEZIONARE",
        description:
          "Alla fine del tuo turno, se questo personaggio è impegnato, puoi preparare uno dei tuoi altri personaggi a tua scelta.",
      },
    ],
  },
};
