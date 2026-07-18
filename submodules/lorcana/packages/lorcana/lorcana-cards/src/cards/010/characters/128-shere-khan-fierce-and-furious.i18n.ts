import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shereKhanFierceAndFuriousI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shere Khan",
    version: "Fierce and Furious",
    text: [
      {
        title: "Shift 5 {I}",
      },
      {
        title: "WILD RAGE 1",
        description:
          "{I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Shir Khan",
    version: "Wild und Wütend",
    text: [
      {
        title:
          "<Gestaltwandel> 5 {I} (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Shir-Khan-Charaktere auszuspielen.)",
      },
      {
        title: "Wilder Zorn",
        description:
          "1 {I}, Füge diesem Charakter 1 Schaden zu — Mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Shere Khan",
    version: "Furieusement féroce",
    text: [
      {
        title:
          "<Alter> 5 {I} (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages nommé Shere Khan.)",
      },
      {
        title: "Rage sauvage",
        description:
          "1 {I}, Infligez 1 dommage à ce personnage — Redressez ce personnage. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Shere Khan",
    version: "Feroce e Furioso",
    text: [
      {
        title:
          "<Trasformazione> 5 {I} (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Shere Khan.)",
      },
      {
        title: "Collera Selvaggia",
        description:
          "1 {I}, infliggi 1 danno a questo personaggio — Prepara questo personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Shere Khan",
    version: "Feroz y furioso",
    text: [
      {
        title: "Cambio 5 {I}",
      },
      {
        title: "FURIA SALVAJE 1",
        description:
          "{I}, inflige 1 daño a este personaje: prepara a este personaje. No puede realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
