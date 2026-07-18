import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rafikisBakoraStaffI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rafiki's Bakora Staff",
    text: [
      {
        title: "READ THE OMENS",
        description: "{E}, 1 {I} — Draw a card, then choose and discard a card.",
      },
      {
        title: "BONK! 1",
        description: "{I}, Banish this item — Deal 1 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Rafikis Bakora-Stab",
    text: [
      {
        title: "Lies die Omen",
        description:
          "{E}, 1 {I} — Ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
      {
        title: "Bonk!",
        description:
          "1 {I}, Verbanne diesen Gegenstand — Füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Bâton bakora de Rafiki",
    text: [
      {
        title: "Lire les présages",
        description: "{E}, 1 {I} — Piochez une carte puis défaussez une carte.",
      },
      {
        title: "Paf!",
        description:
          "1 {I}, Bannissez cet objet — Choisissez un personnage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Bastone Bakora di Rafiki",
    text: [
      {
        title: "Leggere i Segni",
        description: "{E}, 1 {I} — Pesca una carta, poi scegli e scarta una carta.",
      },
      {
        title: "Bonk!",
        description:
          "1 {I}, esilia questo oggetto — Infliggi 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
  es: {
    name: "Bastón Bakora de Rafiki",
    text: [
      {
        title: "LEER LOS PRESAGIOS",
        description: "{E}, 1 {I}: roba una carta, luego elige y descarta una carta.",
      },
      {
        title: "¡MALdita sea! 1",
        description: "{I}, destierra este objeto: inflige 1 daño al personaje elegido.",
      },
    ],
  },
};
