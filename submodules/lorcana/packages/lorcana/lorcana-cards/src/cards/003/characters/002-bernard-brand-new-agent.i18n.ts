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
        title: "Ich schau mich mal ein bisschen um",
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
        title: "Je vais voir ce qu'il en est",
        description:
          "À la fin de votre tour, si ce personnage est épuisé, vous pouvez choisir et redresser l'un de vos autres personnages.",
      },
    ],
  },
  it: {
    name: "Bernie",
    version: "Agente Novello",
    text: [
      {
        title: "Vado a Ispezionare",
        description:
          "Alla fine del tuo turno, se questo personaggio è impegnato, puoi preparare uno dei tuoi altri personaggi a tua scelta.",
      },
    ],
  },
};
