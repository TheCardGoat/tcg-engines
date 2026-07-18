import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bambiLittlePrinceEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bambi",
    version: "Little Prince",
    text: [
      {
        title: "SAY HELLO",
        description: "When you play this character, gain 1 lore.",
      },
      {
        title: "KIND OF BASHFUL",
        description: "When an opponent plays a character, return this character to your hand.",
      },
    ],
  },
  de: {
    name: "Bambi",
    version: "Kleiner Prinz",
    text: [
      {
        title: "Sag Hallo",
        description: "Wenn du diesen Charakter ausspielst, sammelst du 1 Legende.",
      },
      {
        title: "Sehr schüchtern",
        description:
          "Jedes Mal, wenn eine gegnerische Person einen Charakter ausspielt, nimm diesen Charakter zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Bambi",
    version: "Petit prince",
    text: [
      {
        title: "Dis-lui bonjour",
        description: "Lorsque vous jouez ce personnage, gagnez 1 éclat de Lore.",
      },
      {
        title: "Un peu timide",
        description:
          "Lorsqu'un adversaire joue un personnage, renvoyez ce personnage-ci dans votre main.",
      },
    ],
  },
  it: {
    name: "Bambi",
    version: "Principino",
    text: [
      {
        title: "Saluta",
        description: "Quando giochi questo personaggio, ottieni 1 leggenda.",
      },
      {
        title: "È un po' Timido",
        description:
          "Quando un avversario gioca un personaggio, riprendi in mano questo personaggio.",
      },
    ],
  },
  es: {
    name: "Bambi",
    version: "Principito",
    text: [
      {
        title: "DI HOLA",
        description: "Cuando juegas con este personaje, ganas 1 conocimiento.",
      },
      {
        title: "TIPO DE tímido",
        description: "Cuando un oponente juega un personaje, devuelve este personaje a tu mano.",
      },
    ],
  },
};
