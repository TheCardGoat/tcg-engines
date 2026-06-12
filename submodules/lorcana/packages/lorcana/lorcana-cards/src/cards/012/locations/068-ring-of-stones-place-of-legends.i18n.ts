import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ringOfStonesPlaceOfLegendsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ring of Stones",
    version: "Place of Legends",
    text: [
      {
        title: "Follow Your Fate",
        description: "Your exerted characters can move here for free.",
      },
      {
        title: "Part the Veil",
        description: "Once during your turn, whenever a character moves here, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Ring aus Steinen",
    version: "Der Ort der Legenden",
    text: [
      {
        title: "Folge deinem Schicksal",
        description: "Deine erschöpften Charaktere können sich kostenlos zu diesem Ort bewegen.",
      },
      {
        title: "Lüfte den Schleier",
        description:
          "Einmal während deines Zuges, wenn einer deiner Charaktere an diesen Ort bewegt wird, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Cercle de pierres",
    version: "Lieu de légendes",
    text: [
      {
        title: "Suis ton destin",
        description: "Vous pouvez déplacer gratuitement vos personnages épuisés sur ce lieu.",
      },
      {
        title: "Lever le voile",
        description:
          "Une fois durant votre tour, lorsqu'un personnage est déplacé sur ce lieu, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Cerchio di Pietre",
    version: "Luogo di Leggende",
    text: [
      {
        title: "Segui il tuo Destino",
        description: "I tuoi personaggi impegnati possono spostarsi in questo luogo gratis.",
      },
      {
        title: "Solleva il Velo",
        description:
          "Una volta durante il tuo turno, ogni volta che un personaggio si sposta in questo luogo, ottieni 1 leggenda.",
      },
    ],
  },
};
