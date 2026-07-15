import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rlsLegacysCannonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "RLS Legacy's Cannon",
    text: [
      {
        title: "BA-BOOM!",
        description: "{E}, 2 {I}, Discard a card — Deal 2 damage to chosen character or location.",
      },
    ],
  },
  de: {
    name: "Kanone der RLS Legacy",
    text: [
      {
        title: "Baa-Bumm!",
        description:
          "{E}, 2 {I}, Wirf 1 Karte ab — Füge einem Charakter oder Ort deiner Wahl 2 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Canon du RLS Héritage",
    text: [
      {
        title: "Ba-Boum!",
        description:
          "{E}, 2 {I}, Défaussez une carte — Choisissez un personnage ou un lieu et infligez-lui 2 dommages.",
      },
    ],
  },
  it: {
    name: "Cannone della RLS Legacy",
    text: [
      {
        title: "Ba-Bum!",
        description:
          "{E}, 2 {I}, scarta una carta — Infliggi 2 danni a un personaggio o a un luogo a tua scelta.",
      },
    ],
  },
};
