import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { embraceUrsur } from "./embrace-ursur.ts";
const textByColor = {
  red: "When this attacks, you may banish a card from your hand. If it's Runeblade, create a Runechant token. If it's Shadow, this gets go again.",
  yellow:
    "When this attacks, you may banish a card from your hand. If it's Runeblade, create a Runechant token. If it's Shadow, this gets go again.",
  blue: "When this attacks, you may banish a card from your hand. If it's Runeblade, create a Runechant token. If it's Shadow, this gets go again.",
} as const;
export const embraceUrsurI18n = defineFamilyI18n(embraceUrsur, {
  en: {
    name: "Embrace Ursur",
    typeText: "Shadow Runeblade Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const {
  red: embraceUrsurRedI18n,
  yellow: embraceUrsurYellowI18n,
  blue: embraceUrsurBlueI18n,
} = embraceUrsurI18n.cards;
