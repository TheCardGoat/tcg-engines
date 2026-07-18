import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const redAlertI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Red Alert",
    text: "Banish chosen character with 3 {S} or less. If you have a Monster character in play, chosen opponent loses 1 lore.",
  },
  de: {
    name: "Alarmstufe Rot",
    text: "Verbanne einen Charakter deiner Wahl mit 3 oder weniger {S}. Wenn du mindestens einen Monster-Charakter im Spiel hast, verliert eine gegnerische Person deiner Wahl 1 Legende.",
  },
  fr: {
    name: "Alerte rouge",
    text: "Choisissez un personnage ayant 3 {S} ou moins et bannissez-le. Si vous avez un personnage Monstre en jeu, choisissez un adversaire qui perd 1 éclat de Lore.",
  },
  it: {
    name: "Allarme Rosso",
    text: "Esilia un personaggio a tua scelta con 3 {S} o inferiore. Se hai in gioco un personaggio Mostro, un avversario a tua scelta perde 1 leggenda.",
  },
  es: {
    name: "Alerta roja",
    text: "Destierra al personaje elegido con 3 {S} o menos. Si tienes un personaje Monstruo en juego, el oponente elegido pierde 1 conocimiento.",
  },
};
