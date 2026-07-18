import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const auroraLoreGuardianI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aurora",
    version: "Lore Guardian",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "PRESERVER",
        description: "Opponents can't choose your items for abilities or effects.",
      },
      {
        title: "ROYAL INVENTORY",
        description:
          "{E} one of your items — Look at the top card of your deck and put it on either the top or the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "Aurora",
    version: "Wächterin der Legenden",
    text: [
      {
        title:
          "<Gestaltwandel> 2 (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Aurora-Charaktere auszuspielen.)",
      },
      {
        title: "Bewahrerin",
        description: "Gegnerische Karten können deine Gegenstände nicht auswählen.",
      },
      {
        title: "Königliches Sortiment",
        description:
          "{E} einen deiner Gegenstände — Schaue dir die oberste Karte deines Decks an und lege sie anschließend entweder auf dein Deck oder darunter.",
      },
    ],
  },
  fr: {
    name: "Aurore",
    version: "Gardienne de Lore",
    text: [
      {
        title:
          "<Alter> 2 (Vous pouvez payer 2 {I} pour jouer ce personnage sur l'un de vos personnages Aurore.)",
      },
      {
        title: "Sauveuse",
        description:
          "Vos adversaires ne peuvent pas choisir vos objets avec leurs capacités et effets de cartes.",
      },
      {
        title: "Inventaire Royal",
        description:
          "{E} l'un de vos objets — Regardez la première carte de votre pioche. Remettez-la soit sur le dessus, soit en-dessous.",
      },
    ],
  },
  it: {
    name: "Aurora",
    version: "Guardiana della Leggenda",
    text: [
      {
        title:
          "<Trasformazione> 2 (Puoi pagare 2 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Aurora.)",
      },
      {
        title: "Conservatrice",
        description: "Gli avversari non possono scegliere i tuoi oggetti per abilità o effetti.",
      },
      {
        title: "Inventario Reale",
        description:
          "{E} uno dei tuoi oggetti — Guarda la prima carta del tuo mazzo e mettila in cima o in fondo al tuo mazzo.",
      },
    ],
  },
  es: {
    name: "Aurora",
    version: "Guardián de la tradición",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "CONSERVADOR",
        description: "Los oponentes no pueden elegir tus elementos para habilidades o efectos.",
      },
      {
        title: "INVENTARIO REAL",
        description:
          "{E} uno de tus objetos: mira la carta superior de tu mazo y colócala en la parte superior o inferior de tu mazo.",
      },
    ],
  },
};
