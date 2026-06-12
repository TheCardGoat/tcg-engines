import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const twinFireI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Twin Fire",
    text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
  },
  de: {
    name: "Zwillingsfeuer",
    text: "Füge einem Charakter deiner Wahl 2 Schaden zu. Dann darfst du eine Karte von deiner Hand auswählen und abwerfen, um einem anderen Charakter deiner Wahl 2 Schaden zuzufügen.",
  },
  fr: {
    name: "Tir jumelé",
    text: "Choisissez un personnage et infligez-lui 2 dommages. Ensuite, vous pouvez défausser une carte pour choisir un autre personnage et lui infliger 2 dommages.",
  },
  it: {
    name: "Fuoco Gemello",
    text: "Infliggi 2 danni a un personaggio a tua scelta. Poi, puoi scegliere e scartare una carta per infliggere 2 danni a un altro personaggio a tua scelta.",
  },
};
