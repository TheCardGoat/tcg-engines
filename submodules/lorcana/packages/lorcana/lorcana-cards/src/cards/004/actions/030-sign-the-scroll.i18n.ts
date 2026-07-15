import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const signTheScrollI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sign the Scroll",
    text: "Each opponent may choose and discard a card. For each opponent who doesn't, you gain 2 lore.",
  },
  de: {
    name: "Unterschreib die Rolle",
    text: "Alle gegnerischen Mitspielenden dürfen je 1 Karte aus ihrer Hand wählen und abwerfen. Pro gegnerischer Person, die keine Karte abwirft, sammelst du 2 Legenden.",
  },
  fr: {
    name: "Signe le contrat",
    text: "Chaque adversaire peut choisir et défausser une carte. Vous gagnez 2 éclats de Lore pour chaque adversaire qui ne le fait pas.",
  },
  it: {
    name: "Firma Questa Pergamena",
    text: "Ogni avversario può scegliere e scartare una carta. Per ogni avversario che non lo fa, ottieni 2 leggenda.",
  },
};
