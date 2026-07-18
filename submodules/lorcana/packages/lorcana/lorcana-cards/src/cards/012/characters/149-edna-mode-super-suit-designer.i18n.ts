import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ednaModeSuperSuitDesignerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Edna Mode",
    version: "Super Suit Designer",
    text: [
      {
        title: "KEY ACCESSORY",
        description: "{E} — Ready chosen item.",
      },
      {
        title: "ALL THE BASICS",
        description: "While you have an item named Super Suit in play, this character gains Ward.",
      },
    ],
  },
  de: {
    name: "Edna Mode",
    version: "Superanzug-Designerin",
    text: [
      {
        title: "Wichtiges Zubehör",
        description: "{E} — Mache einen Gegenstand deiner Wahl bereit.",
      },
      {
        title: "Alle Grundlagen",
        description:
          "Solange du mindestens einen Superanzug-Gegenstand im Spiel hast, erhält dieser Charakter <Behütet>.",
      },
    ],
  },
  fr: {
    name: "Edna Mode",
    version: "Créatrice de Super-costume",
    text: [
      {
        title: "Accessoire clé",
        description: "{E} — Choisissez un objet et redressez-le.",
      },
      {
        title: "Le minimum syndical",
        description:
          "Tant que vous avez un objet nommé Super-costume en jeu, ce personnage gagne <Hors d'atteinte>.",
      },
    ],
  },
  it: {
    name: "Edna Mode",
    version: "Stilista di Super Tute",
    text: [
      {
        title: "Accessorio Chiave",
        description: "{E} — Prepara un oggetto a tua scelta.",
      },
      {
        title: "Tutti i Capi Essenziali",
        description:
          "Mentre hai in gioco un oggetto chiamato Super Tuta, questo personaggio ottiene <Protetto>. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
  es: {
    name: "Modo Edna",
    version: "Súper diseñador de trajes",
    text: [
      {
        title: "ACCESORIO LLAVE",
        description: "{E}: elemento elegido listo.",
      },
      {
        title: "TODOS LOS BÁSICOS",
        description:
          "Mientras tengas un objeto llamado Super Suit en juego, este personaje gana Ward.",
      },
    ],
  },
};
