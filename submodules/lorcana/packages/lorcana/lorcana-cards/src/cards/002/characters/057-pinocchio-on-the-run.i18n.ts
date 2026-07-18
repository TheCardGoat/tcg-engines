import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pinocchioOnTheRunI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pinocchio",
    version: "On the Run",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "LISTEN TO YOUR CONSCIENCE",
        description:
          "When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
      },
    ],
  },
  de: {
    name: "Pinocchio",
    version: "Auf der Flucht",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Pinocchio-Charaktere auszuspielen.)",
      },
      {
        title: "Hör auf dein Gewissen",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Charakter oder Gegenstand deiner Wahl, der 3 oder weniger kostet, zurück auf die zugehörige Hand schicken.",
      },
    ],
  },
  fr: {
    name: "Pinocchio",
    version: "Livré à lui-même",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Pinocchio.)",
      },
      {
        title: "Écoute ta conscience",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir soit un personnage soit un objet coûtant 3 ou moins et le renvoyer dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Pinocchio",
    version: "On the Run",
    text: [
      {
        title:
          "<Shift> 3 (You may pay 3 {I} to play this on top of one of your characters named Pinocchio.)",
      },
      {
        title: "Listen to Your Conscience",
        description:
          "When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
      },
    ],
  },
  es: {
    name: "Pinocho",
    version: "En la carrera",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "ESCUCHA TU CONCIENCIA",
        description:
          "Cuando juegas con este personaje, puedes devolver el personaje u objeto elegido con un coste de 3 o menos a la mano de su jugador.",
      },
    ],
  },
};
