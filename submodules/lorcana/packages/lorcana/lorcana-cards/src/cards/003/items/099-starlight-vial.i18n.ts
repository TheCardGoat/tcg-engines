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
        title: "Wirksame Energie",
        description:
          "{E} — Du zahlst 2 {I} weniger für die nächste Aktion, die du in diesem Zug ausspielst.",
      },
      {
        title: "Falle",
        description:
          "2 {I}, Verbanne diesen Gegenstand — Ziehe 2 Karten. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
    ],
  },
  fr: {
    name: "Fiole de lumière d'étoile",
    text: [
      {
        title: "Énergie efficace",
        description:
          "{E} — La prochaine carte Action que vous jouez durant ce tour vous coûte 2 {I} de moins.",
      },
      {
        title: "Piège",
        description:
          "2 {I}, Bannissez cet objet — Piochez 2 cartes puis choisissez et défaussez une carte.",
      },
    ],
  },
  it: {
    name: "Fiala di Luce Stellare",
    text: [
      {
        title: "Energia Efficiente",
        description:
          "{E} — Paga 2 {I} in meno per giocare la tua prossima azione per questo turno.",
      },
      {
        title: "Trappola",
        description: "2 {I}, esilia questo oggetto — Pesca 2 carte, poi scegli e scarta una carta.",
      },
    ],
  },
};
