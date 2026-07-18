import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const windstormI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Windstorm",
    text: "Deal 1 damage to each opposing character and location. Then, deal 2 damage to each opposing character with Evasive and each opposing location with Evasive.",
  },
  de: {
    name: "Windsturm",
    text: "Füge jedem gegnerischen Charakter und Ort 1 Schaden zu. Dann, füge jedem gegnerischen Charakter mit <Wendig> und jedem gegnerischen Ort mit <Wendig> 2 Schaden zu.",
  },
  fr: {
    name: "Tempête",
    text: "Infligez 1 dommage à chaque personnage adverse et à chaque lieu adverse. Ensuite, infligez 2 dommages à chaque personnage adverse avec <Insaisissable> et à chaque lieu adverse avec <Insaisissable>.",
  },
  it: {
    name: "Tempesta di Vento",
    text: "Infliggi 1 danno a ogni personaggio e luogo avversario. Poi, infliggi 2 danni a ogni personaggio avversario con <Sfuggente> e a ogni luogo avversario con <Sfuggente>.",
  },
  es: {
    name: "Tormenta de viento",
    text: "Inflige 1 daño a cada personaje y ubicación oponentes. Luego, inflige 2 daños a cada personaje contrario con Evasivo y a cada ubicación opuesta con Evasivo.",
  },
};
