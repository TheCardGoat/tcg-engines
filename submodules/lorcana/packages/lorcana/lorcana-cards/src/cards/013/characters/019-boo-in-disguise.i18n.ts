import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const booInDisguiseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Boo",
    version: "In Disguise",
    text: [
      {
        title: "You're Safe Now",
        description:
          "While you have an exerted character named Sulley in play, this character can't be challenged.",
      },
    ],
  },
  de: {
    name: "Buh",
    version: "Verkleidet",
    text: [
      {
        title: "Du bist jetzt in Sicherheit",
        description:
          "Solange du mindestens einen erschöpften Charakter namens Sulley im Spiel hast, kann dieser Charakter nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Bouh",
    version: "En déguisement",
    text: [
      {
        title: "Tu es en sécurité ici",
        description:
          "Tant que vous avez un personnage épuisé nommé Sulli en jeu, ce personnage-ci ne peut pas être défié.",
      },
    ],
  },
  it: {
    name: "Boo",
    version: "In Maschera",
    text: [
      {
        title: "Ora Sei al Sicuro",
        description:
          "Mentre hai in gioco un personaggio impegnato chiamato Sulley, questo personaggio non può essere sfidato.",
      },
    ],
  },
  es: {
    name: "Abucheo",
    version: "Disfrazado",
    text: [
      {
        title: "Estás a salvo ahora",
        description:
          "Si bien tienes en juego un personaje ejercido llamado Sulley, este personaje no puede ser desafiado.",
      },
    ],
  },
};
