import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tinyTimsCrutchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tiny Tim's Crutch",
    text: [
      {
        title: "AT YOUR SIDE",
        description:
          "{E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Krücke des kleinen Tim",
    text: [
      {
        title: "An deiner Seite",
        description:
          "{E} — Ein Charakter deiner Wahl erhält in diesem Zug <Unterstützen>. (Jedes Mal, wenn der Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Béquille de Tiny Tim",
    text: [
      {
        title: "À vos côtés",
        description:
          "{E} — Choisissez un personnage qui gagne <Soutien> pour le reste de ce tour. (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Stampella del Piccolo Tim",
    text: [
      {
        title: "Al Tuo Fianco",
        description:
          "{E} — Un personaggio a tua scelta ottiene <Aiutante> per questo turno. (Ogni volta che va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
  es: {
    name: "La muleta del pequeño Tim",
    text: [
      {
        title: "A TU LADO",
        description:
          "{E}: el personaje elegido obtiene apoyo este turno. (Siempre que realicen una misión, puedes agregar su {S} al {S} de otro personaje elegido este turno).",
      },
    ],
  },
};
