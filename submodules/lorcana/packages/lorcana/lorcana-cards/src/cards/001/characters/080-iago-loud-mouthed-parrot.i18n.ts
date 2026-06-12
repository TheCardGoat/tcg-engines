import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iagoLoudmouthedParrotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Iago",
    version: "Loud-Mouthed Parrot",
    text: [
      {
        title: "YOU GOT A PROBLEM?",
        description:
          "{E} — Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      },
    ],
  },
  de: {
    name: "Jago",
    version: "Großmäuliger Papagei",
    text: [
      {
        title: "HAST DU'N PROBLEM?",
        description:
          "— Ein Charakter deiner Wahl erhält in seinem nächsten Zug Impulsiv. (Der Charakter kann nicht erkunden und muss herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "IAGO",
    version: "Perroquet braillard",
    text: [
      {
        title: "T'AS UN",
        description:
          "PROBLÈME? — Choisissez un personnage, il gagne Combattant durant son prochain tour. (Il ne peut pas être envoyé à l'aventure et doit défier à chaque tour s'il le peut.)",
      },
    ],
  },
  it: {
    name: "Iago",
    version: "Loud-Mouthed Parrot",
    text: [
      {
        title: "YOU GOT A PROBLEM?",
        description:
          "— Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      },
    ],
  },
};
