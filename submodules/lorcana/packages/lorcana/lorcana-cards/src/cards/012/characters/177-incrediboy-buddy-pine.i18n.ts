import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const incrediboyBuddyPineI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Incrediboy",
    version: "Buddy Pine",
    text: [
      {
        title: "NERDING OUT",
        description: "When you play this character, if a Hero character is in play, gain 1 lore.",
      },
      {
        title: "SPOILER ALERT",
        description: "This character also counts as being named Syndrome for Shift.",
      },
    ],
  },
  de: {
    name: "Incrediboy",
    version: "Buddy Pine",
    text: [
      {
        title: "Begeisterter Fan",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens ein Held im Spiel ist, sammelst du 1 Legende.",
      },
      {
        title: "Spoilerwarnung",
        description:
          "Du kannst einen Syndrom-Charakter mit der <Gestaltwandel>-Fähigkeit auf diesen Charakter ausspielen.",
      },
    ],
  },
  fr: {
    name: "Indestructiboy",
    version: "Buddy Pine",
    text: [
      {
        title: "Trop fan",
        description:
          "Lorsque vous jouez ce personnage, si un personnage Héros est en jeu, gagnez 1 éclat de Lore.",
      },
      {
        title: "Attention, Spoiler",
        description:
          "Ce personnage peut être considéré comme un personnage nommé Syndrome pour la capacité <Alter>.",
      },
    ],
  },
  it: {
    name: "Incrediboy",
    version: "Buddy Pine",
    text: [
      {
        title: "Fare il Nerd",
        description:
          "Quando giochi questo personaggio, se un personaggio Eroe è in gioco, ottieni 1 leggenda.",
      },
      {
        title: "Attenzione Spoiler",
        description:
          "Questo personaggio conta come se si chiamasse anche Sindrome per <Trasformazione>.",
      },
    ],
  },
};
