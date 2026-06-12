import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSilverShipsCookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Silver",
    version: "Ship's Cook",
    text: [
      {
        title: "HUNK OF HARDWARE",
        description:
          "When you play this character, chosen character can't challenge during their next turn.",
      },
    ],
  },
  de: {
    name: "John Silver",
    version: "Schiffskoch",
    text: [
      {
        title: "EIN EISENWARENLADEN",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen Charakter. Er kann in seinem nächsten Zug nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "John Silver",
    version: "Maître-coq du vaisseau",
    text: [
      {
        title: "BELLE QUINCAILLERIE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui ne peut pas défier lors de son prochain tour.",
      },
    ],
  },
  it: {
    name: "John Silver",
    version: "Cuoco di Bordo",
    text: [
      {
        title: "STRANA FERRAGLIA",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta non può sfidare durante il suo prossimo turno.",
      },
    ],
  },
};
