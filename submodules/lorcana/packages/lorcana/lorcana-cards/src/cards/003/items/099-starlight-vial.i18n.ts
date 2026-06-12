import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const starlightVialI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Starlight Vial",
    text: [
      {
        title: "EFFICIENT ENERGY",
        description: "{E} — You pay 2 {I} less for the next action you play this turn.",
      },
      {
        title: "TRAP 2",
        description: "{I}, Banish this item — Draw 2 cards, then choose and discard a card.",
      },
    ],
  },
  de: {
    name: "Sternenlicht-Phiole",
    text: [
      {
        title: "WIRKSAME ENERGIE",
        description:
          "— Du zahlst 2 weniger für die nächste Aktion, die du in diesem Zug ausspielst.",
      },
      {
        title: "FALLE 2,",
        description:
          "Verbanne diesen Gegenstand — Ziehe 2 Karten. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
    ],
  },
  fr: {
    name: "Fiole de lumière d'étoile",
    text: [
      {
        title: "ÉNERGIE EFFICACE",
        description:
          "— La prochaine carte Action que vous jouez durant ce tour vous coûte 2 de moins.",
      },
      {
        title: "PIÈGE",
        description:
          "2, Bannissez cet objet — Piochez 2 cartes puis choisissez et défaussez une carte.",
      },
    ],
  },
  it: {
    name: "Fiala di Luce Stellare",
    text: [
      {
        title: "ENERGIA EFFICIENTE",
        description: "— Paga 2 in meno per giocare la tua prossima azione per questo turno.",
      },
      {
        title: "TRAPPOLA 2,",
        description: "esilia questo oggetto — Pesca 2 carte, poi scegli e scarta una carta.",
      },
    ],
  },
};
