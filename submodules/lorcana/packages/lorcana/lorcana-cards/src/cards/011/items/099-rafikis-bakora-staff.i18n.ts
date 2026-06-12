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
        title: "LIES DIE OMEN, 1",
        description: "— Ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
      {
        title: "BONK! 1,",
        description: "Verbanne diesen Gegenstand — Füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Bâton bakora de Rafiki",
    text: [
      {
        title: "LIRE LES",
        description: "PRÉSAGES, 1 — Piochez une carte puis défaussez une carte.",
      },
      {
        title: "PAF! 1,",
        description: "Bannissez cet objet — Choisissez un personnage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Bastone Bakora di Rafiki",
    text: [
      {
        title: "LEGGERE I SEGNI, 1",
        description: "— Pesca una carta, poi scegli e scarta una carta.",
      },
      {
        title: "BONK! 1,",
        description: "esilia questo oggetto — Infliggi 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
};
