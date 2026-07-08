import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theWeedwhackerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Weedwhacker",
    text: [
      {
        title: "Full Power",
        description:
          "{E}, 1 {I} — Chosen character gains <Challenger> +2 this turn. (They get +2 {S} while challenging.)",
      },
      {
        title: "Clear-Cut",
        description: "2 {I}, Banish this item — Banish chosen Vineling character.",
      },
    ],
  },
  de: {
    name: "Der Unkrautvernichter",
    text: [
      {
        title: "Volle Kraft",
        description:
          "{E}, 1 {I} — Ein Charakter deiner Wahl erhält in diesem Zug <Herausfordern> +2. (Während der Charakter herausfordert, erhält er +2 {S}.)",
      },
      {
        title: "Klarer Schnitt",
        description:
          "2 {I}, Verbanne diesen Gegenstand — Verbanne einen Rankenbrut-Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "La débroussailleuse",
    text: [
      {
        title: "À pleine puissance",
        description:
          "{E}, 1 {I} — Choisissez un personnage qui gagne <Offensif> +2 pour le reste de ce tour.",
      },
      {
        title: "Coupe nette",
        description:
          "2 {I}, Bannissez cet objet — Choisissez un personnage Pousse et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Il Diserbatore",
    text: [
      {
        title: "Piena Potenza",
        description:
          "{E}, 1 {I} — Un personaggio a tua scelta ottiene <Sfidante> +2 per questo turno. (Riceve +2 {S} mentre sta sfidando.)",
      },
      {
        title: "Taglio Netto",
        description: "2 {I}, esilia questo oggetto — Esilia un personaggio Virgulto a tua scelta.",
      },
    ],
  },
};
