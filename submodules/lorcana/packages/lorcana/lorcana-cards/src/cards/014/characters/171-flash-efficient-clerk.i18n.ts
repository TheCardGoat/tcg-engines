import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flashEfficientClerkI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flash",
    version: "Efficient Clerk",
    text: [
      {
        title: "Resist +1",
      },
      {
        title: "Take... Your... Time",
        description: "All characters lose Rush and can't gain Rush.",
      },
    ],
  },
  de: {
    name: "Flash",
    version: "Effizienter Sachbearbeiter",
    text: [
      {
        title:
          "<Robust> +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
      {
        title: "Nimm... dir... Zeit",
        description: "Alle Charaktere verlieren <Rasant> und können <Rasant> nicht erhalten.",
      },
    ],
  },
  fr: {
    name: "Flash",
    version: "Employé efficace",
    text: [
      {
        title: "<Résistance> +1",
      },
      {
        title: "Prenez... votre... temps",
        description: "Tous les personnages perdent <Charge> et ne peuvent pas gagner <Charge>.",
      },
    ],
  },
  it: {
    name: "Flash",
    version: "Impiegato Efficiente",
    text: [
      {
        title: "<Resistere> +1",
      },
      {
        title: "Fai... Con... Calma",
        description: "Tutti i personaggi perdono <Lesto> e non possono ottenere <Lesto>.",
      },
    ],
  },
  es: {
    name: "Flash",
    version: "Efficient Clerk",
    text: [
      {
        title: "Resist +1",
      },
      {
        title: "Take... Your... Time",
        description: "All characters lose Rush and can't gain Rush.",
      },
    ],
  },
};
