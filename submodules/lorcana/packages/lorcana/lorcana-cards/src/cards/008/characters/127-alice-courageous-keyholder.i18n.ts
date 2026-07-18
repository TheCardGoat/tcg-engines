import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aliceCourageousKeyholderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alice",
    version: "Courageous Keyholder",
    text: [
      {
        title: "THIS WAY OUT",
        description:
          "When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Alice",
    version: "Mutige Schlüsselträgerin",
    text: [
      {
        title: "Hierlang geht's raus",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen deiner beschädigten Charaktere bereit machen. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Alice",
    version: "Courageuse porteuse de clé",
    text: [
      {
        title: "Par ici la sortie",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir l'un de vos personnages avec un dommage ou plus et le redresser. Ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Alice",
    version: "Coraggiosa Custode della Chiave",
    text: [
      {
        title: "Da Questa Parte",
        description:
          "Quando giochi questo personaggio, puoi preparare un tuo personaggio danneggiato a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Alicia",
    version: "Llavero valiente",
    text: [
      {
        title: "ESTA SALIDA",
        description:
          "Cuando juegas con este personaje, es posible que ya hayas elegido tu personaje dañado. No pueden realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
