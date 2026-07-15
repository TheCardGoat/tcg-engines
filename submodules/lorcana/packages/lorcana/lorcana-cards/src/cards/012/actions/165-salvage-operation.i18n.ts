import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const salvageOperationI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Salvage Operation",
    text: "Return an item card from your discard to your hand. If you have a character with 4 {W} or more in play, gain 1 lore.",
  },
  de: {
    name: "Bergungsarbeiten",
    text: "Nimm 1 Gegenstandskarte aus deinem Ablagestapel zurück auf deine Hand. Falls du mindestens einen Charakter mit 4 oder mehr {W} im Spiel hast, sammelst du 1 Legende.",
  },
  fr: {
    name: "Réparations de fortune",
    text: "Renvoyez dans votre main une carte Objet de votre défausse. Si vous avez un personnage ayant 4 {W} ou plus en jeu, gagnez 1 éclat de Lore.",
  },
  it: {
    name: "Operazione di Recupero",
    text: "Riprendi in mano una carta oggetto dai tuoi scarti. Se hai in gioco un personaggio con 4 {W} o superiore, ottieni 1 leggenda.",
  },
};
