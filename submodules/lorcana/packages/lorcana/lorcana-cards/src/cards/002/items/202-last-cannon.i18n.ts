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
        title: "Bewaffne dich",
        description:
          "1 {I}, Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält in diesem Zug <Herausfordern> +3. (Während der Charakter herausfordert, erhält er +3 {S}.)",
      },
    ],
  },
  fr: {
    name: "Dernier canon",
    text: [
      {
        title: "Arme-toi",
        description:
          "1 {I}, Bannissez cet objet — Choisissez un personnage, il gagne <Offensif> +3 pour le reste de ce tour. (Lorsqu'il défie, ce personnage gagne + 3 {S}.)",
      },
    ],
  },
  it: {
    name: "Last Cannon",
    text: [
      {
        title: "Arm Yourself",
        description:
          "1 {I}, Banish this item — Chosen character gains <Challenger> +3 this turn. (They get +3 {S} while challenging.)",
      },
    ],
  },
  es: {
    name: "Último cañón",
    text: [
      {
        title: "ARMATE 1",
        description:
          "{I}, desterrar este objeto: el personaje elegido obtiene Challenger +3 este turno. (Obtienen +3 {S} mientras desafían).",
      },
    ],
  },
};
