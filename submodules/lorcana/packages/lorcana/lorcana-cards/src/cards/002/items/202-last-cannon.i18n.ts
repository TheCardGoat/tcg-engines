import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lastCannonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Last Cannon",
    text: [
      {
        title: "ARM YOURSELF 1",
        description:
          "{I}, Banish this item — Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Letzte Kanone",
    text: [
      {
        title: "BEWAFFNE DICH 1,",
        description:
          "Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält in diesem Zug Herausfordern +3. (Während der Charakter herausfordert, erhält er +3.)",
      },
    ],
  },
  fr: {
    name: "Dernier canon",
    text: [
      {
        title: "ARME-TOI 1,",
        description:
          "Bannissez cet objet — Choisissez un personnage, il gagne Offensif +3 pour le reste de ce tour. (Lorsqu'il défie, ce personnage gagne + 3.)",
      },
    ],
  },
  it: {
    name: "Last Cannon",
    text: [
      {
        title: "ARM YOURSELF 1,",
        description:
          "Banish this item — Chosen character gains Challenger +3 this turn. (They get +3 while challenging.)",
      },
    ],
  },
};
