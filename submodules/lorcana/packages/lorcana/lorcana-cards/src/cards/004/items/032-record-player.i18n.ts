import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const recordPlayerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Record Player",
    text: [
      {
        title: "LOOK AT THIS!",
        description:
          "Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.",
      },
      {
        title: "HIT PARADE",
        description: "Your characters named Stitch count as having +1 cost to sing songs.",
      },
    ],
  },
  de: {
    name: "Schallplattenspieler",
    text: [
      {
        title: "Guck mal hier!",
        description:
          "Jedes Mal, wenn du ein Lied ausspielst, erhält ein Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 {S}.",
      },
      {
        title: "Hitparade",
        description:
          "Die Kosten deiner Stitch-Charaktere gelten als +1 für das Singen von Liedern.",
      },
    ],
  },
  fr: {
    name: "Platine disque",
    text: [
      {
        title: "Regarde!",
        description:
          "Chaque fois que vous jouez une chanson, choisissez un personnage qui subit -2 {S} jusqu'au début de votre prochain tour.",
      },
      {
        title: "Hit parade",
        description:
          "Vos personnages Stitch sont considérés comme ayant un coût de +1 pour chanter des chansons.",
      },
    ],
  },
  it: {
    name: "Giradischi",
    text: [
      {
        title: "Guarda Qua!",
        description:
          "Ogni volta che giochi una canzone, un personaggio a tua scelta riceve -2 {S} fino all'inizio del tuo prossimo turno.",
      },
      {
        title: "Hit Parade",
        description:
          "I tuoi personaggi chiamati Stitch contano come di costo +1 per cantare le canzoni.",
      },
    ],
  },
  es: {
    name: "Tocadiscos",
    text: [
      {
        title: "¡MIRA ESTO!",
        description:
          "Cada vez que reproduces una canción, el personaje elegido obtiene -2 {S} hasta el comienzo de tu siguiente turno.",
      },
      {
        title: "DESFILE DE ÉXITO",
        description:
          "Tus personajes llamados Stitch cuentan con un coste de +1 para cantar canciones.",
      },
    ],
  },
};
