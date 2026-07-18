import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const translationCollarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Translation Collar",
    text: [
      {
        title: "You Are My Friend",
        description:
          "{E}, 1 {I} — Chosen character gets +1 {L} and gains <Support> this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Hundedolmetscher",
    text: [
      {
        title: "Du bist mein Freund",
        description:
          "{E}, 1 {I} — Ein Charakter deiner Wahl erhält in diesem Zug +1 {L} und <Unterstützen>. (Jedes Mal, wenn er erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Collier traducteur",
    text: [
      {
        title: "Tu es mon ami",
        description:
          "{E}, 1 {I} — Choisissez un personnage qui gagne +1 {L} et <Soutien> pour le reste de ce tour. (Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Collare Traduttore",
    text: [
      {
        title: "Sei Mio Amico",
        description:
          "{E}, 1 {I} — Un personaggio a tua scelta riceve +1 {L} e ottiene <Aiutante> per questo turno. (Ogni volta che va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
  es: {
    name: "Collar de traducción",
    text: [
      {
        title: "Eres mi amigo",
        description:
          "{E}, 1 {I}: el personaje elegido obtiene +1 {L} y obtiene <Apoyo> este turno. (Siempre que realicen una misión, puedes agregar su {S} al {S} de otro personaje elegido este turno).",
      },
    ],
  },
};
