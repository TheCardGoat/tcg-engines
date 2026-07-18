import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const helgaSinclairToughAsNailsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Helga Sinclair",
    version: "Tough as Nails",
    text: [
      {
        title: "Challenger +3 (While challenging, this character gets +3 {S}).",
      },
      {
        title: "QUICK REFLEXES",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Helga Sinclair",
    version: "Knallhart",
    text: [
      {
        title: "<Herausfordern> +3 (Während dieser Charakter herausfordert, erhält er +3 {S}.)",
      },
      {
        title: "Schnelle Reflexe",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Helga Sinclair",
    version: "Dure à cuire",
    text: [
      {
        title: "<Offensif> +3",
      },
      {
        title: "Bons réflexes",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Helga Sinclair",
    version: "Dura Come la Roccia",
    text: [
      {
        title: "<Sfidante> +3",
      },
      {
        title: "Riflessi Fulminei",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
  es: {
    name: "Helga Sinclair",
    version: "Duro como las uñas",
    text: [
      {
        title: "Retador +3 (mientras desafía, este personaje obtiene +3 {S}).",
      },
      {
        title: "REFLEJOS RÁPIDOS",
        description:
          "Durante tu turno, este personaje gana Evasivo. (Pueden desafiar a los personajes con Evasivo).",
      },
    ],
  },
};
