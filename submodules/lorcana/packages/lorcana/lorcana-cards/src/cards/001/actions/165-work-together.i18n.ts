import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const workTogetherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Work Together",
    text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  },
  de: {
    name: "Teamwork",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug Unterstützen. (Jedes Mal, wenn der Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "TRAVAIL D'ÉQUIPE",
    text: "Choisissez un personnage, il gagne Soutien pour le reste de ce tour. (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Work Together",
    text: "Chosen character gains <Support> this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  },
  es: {
    name: "Trabajar juntos",
    text: "El personaje elegido gana Apoyo este turno. (Siempre que realicen una misión, puedes agregar su {S} al {S} de otro personaje elegido este turno).",
  },
};
