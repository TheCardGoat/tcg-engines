import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scepterOfArendelleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scepter of Arendelle",
    text: [
      {
        title: "COMMAND",
        description:
          "{E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Zepter von Arendelle",
    text: [
      {
        title: "Befehl",
        description:
          "{E} — Ein Charakter deiner Wahl erhält in diesem Zug Unterstützen. (Jedes Mal, wenn der Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "SCEPTRE D'ARENDELLE",
    text: [
      {
        title: "COMMANDEMENT",
        description:
          "{E} — choisissez un personnage, il gagne Soutien pour le reste de ce tour. (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Scettro di Arendelle",
    text: [
      {
        title: "Comando",
        description:
          "{E} — Un personaggio a tua scelta ottiene <Aiutante> per questo turno. (Ogni volta che va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
  es: {
    name: "Cetro de Arendelle",
    text: [
      {
        title: "DOMINIO",
        description:
          "{E}: el personaje elegido obtiene apoyo este turno. (Siempre que realicen una misión, puedes agregar su {S} al {S} de otro personaje elegido este turno).",
      },
    ],
  },
};
