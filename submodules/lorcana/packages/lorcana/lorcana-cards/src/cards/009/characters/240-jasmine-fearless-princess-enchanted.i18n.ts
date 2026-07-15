import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jasmineFearlessPrincessEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jasmine",
    version: "Fearless Princess",
    text: [
      {
        title: "TAKE THE LEAP",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
      {
        title: "NOW'S MY CHANCE",
        description:
          "Choose and discard a card — This character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Jasmin",
    version: "Furchtlose Prinzessin",
    text: [
      {
        title: "Wage den Sprung",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
      {
        title: "Jetzt ist meine Chance",
        description:
          "Wähle eine Karte aus deiner Hand und wirf sie ab — Dieser Charakter erhält in diesem Zug <Herausfordern> +3. (Während der Charakter herausfordert, erhält er +3 {S}.)",
      },
    ],
  },
  fr: {
    name: "Jasmine",
    version: "Princesse intrépide",
    text: [
      {
        title: "Faire le saut",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier des personnages avec Insaisissable.)",
      },
      {
        title: "C'est le moment ou jamais",
        description:
          "Défaussez une carte — Ce personnage gagne <Offensif> +3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Jasmine",
    version: "Principessa Impavida",
    text: [
      {
        title: "Saltare",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
      {
        title: "Ora è il Mio Momento",
        description:
          "Scegli e scarta una carta — Questo personaggio ottiene <Sfidante> +3 per questo turno. (Riceve +3 {S} mentre sta sfidando.)",
      },
    ],
  },
};
