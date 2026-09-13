import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rootboundCarapace } from "./rootbound-carapace.ts";

export const rootboundCarapaceI18n = defineFamilyI18n(rootboundCarapace, {
  en: {
    name: "Rootbound Carapace",
    text: "Decompose - You may banish 2 Earth cards and an action card from your graveyard. If you do, this gets +1{d}.",
    typeText: "Earth Defense Reaction",
  },
});
export const {
  red: rootboundCarapaceRedI18n,
  yellow: rootboundCarapaceYellowI18n,
  blue: rootboundCarapaceBlueI18n,
} = rootboundCarapaceI18n.cards;
