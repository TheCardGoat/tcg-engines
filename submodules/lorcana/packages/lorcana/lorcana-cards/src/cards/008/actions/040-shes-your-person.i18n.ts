import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shesYourPersonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "She's Your Person",
    text: "Choose one:\n- Remove up to 3 damage from chosen character.\n- Remove up to 3 damage from each of your characters with Bodyguard.",
  },
  de: {
    name: "Sie ist dein Mensch",
    text: [
      {
        title: "Wähle eine Möglichkeit aus:",
      },
      {
        title: "• Entferne bis zu 3 Schaden von einem Charakter deiner Wahl.",
      },
      {
        title: "• Entferne bis zu 3 Schaden von jedem deiner Charaktere mit <Beschützen>.",
      },
    ],
  },
  fr: {
    name: "C’est ta maîtresse",
    text: [
      {
        title: "Choisissez entre:",
      },
      {
        title: "• Choisissez un personnage et retirez-lui jusqu'à 3 dommages.",
      },
      {
        title: "• Retirez jusqu'à 3 dommages de chacun de vos personnages avec <Rempart>.",
      },
    ],
  },
  it: {
    name: "È la tua Penny",
    text: [
      {
        title: "Scegli uno:",
      },
      {
        title: "• Rimuovi fino a 3 danni da un personaggio a tua scelta.",
      },
      {
        title: "• Rimuovi fino a 3 danni da ogni tuo personaggio con <Guardiano>.",
      },
    ],
  },
  es: {
    name: "Ella es tu persona",
    text: "Elige uno:\n- Elimina hasta 3 daños del personaje elegido.\n- Elimina hasta 3 daños de cada uno de tus personajes con Bodyguard.",
  },
};
