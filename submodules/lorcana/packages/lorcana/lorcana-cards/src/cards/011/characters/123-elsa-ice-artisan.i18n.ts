import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const elsaIceArtisanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Elsa",
    version: "Ice Artisan",
    text: [
      {
        title: "Shift 4 {I}",
      },
      {
        title: "ENDLESS WINTER",
        description:
          "When you play this character and whenever you play a location, you may exert chosen character with 3 {S} or less.",
      },
      {
        title: "DISTANT CALL",
        description: "While this character is at a location, she gets +3 {L}.",
      },
    ],
  },
  de: {
    name: "Elsa",
    version: "Eiskünstlerin",
    text: [
      {
        title: "<Gestaltwandel> 4 {I}",
      },
      {
        title: "Endloser Winter",
        description:
          "Wenn du diesen Charakter ausspielst und jedes Mal, wenn du einen Ort ausspielst, darfst du einen Charakter deiner Wahl mit 3 oder weniger {S} erschöpfen.",
      },
      {
        title: "Ruf aus der Ferne",
        description: "Solange dieser Charakter an einem Ort ist, erhält er +3 {L}.",
      },
    ],
  },
  fr: {
    name: "Elsa",
    version: "Artisane de la glace",
    text: [
      {
        title: "<Alter> 4 {I}",
      },
      {
        title: "Hiver sans fin",
        description:
          "Lorsque vous jouez ce personnage et chaque fois que vous jouez un lieu, vous pouvez choisir un personnage ayant 3 {S} ou moins et l'épuiser.",
      },
      {
        title: "Appel lointain",
        description: "Tant que ce personnage est sur un lieu, il gagne +3 {L}.",
      },
    ],
  },
  it: {
    name: "Elsa",
    version: "Artigiana del Ghiaccio",
    text: [
      {
        title: "<Trasformazione> 4 {I}",
      },
      {
        title: "Inverno senza Fine",
        description:
          "Quando giochi questo personaggio e ogni volta che giochi un luogo, puoi impegnare un personaggio a tua scelta con 3 {S} o inferiore.",
      },
      {
        title: "Richiamo Lontano",
        description: "Mentre questo personaggio si trova in un luogo, riceve +3 {L}.",
      },
    ],
  },
};
