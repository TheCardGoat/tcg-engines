import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pennyBoltsPersonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Penny",
    version: "Bolt's Person",
    text: [
      {
        title: "ENDURING LOYALTY",
        description:
          "When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Penny",
    version: "Bolts Frauchen",
    text: [
      {
        title: "Ewige Loyalität",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du bis zu 2 Schaden von einem Charakter deiner Wahl entfernen. Er erhält bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der jenem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Penny",
    version: "Maîtresse de Volt",
    text: [
      {
        title: "Fidélité à toute épreuve",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage. Retirez-lui jusqu'à 2 dommages et il gagne <Résistance> +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Penny",
    version: "Umana di Bolt",
    text: [
      {
        title: "Lealtà Incrollabile",
        description:
          "Quando giochi questo personaggio, puoi rimuovere fino a 2 danni da un personaggio a tua scelta e questo ottiene <Resistere> +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Centavo",
    version: "La persona de Bolt",
    text: [
      {
        title: "LEALTAD DURADERA",
        description:
          "Cuando juegas con este personaje, puedes eliminar hasta 2 daños del personaje elegido y este obtiene Resistencia +1 hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
