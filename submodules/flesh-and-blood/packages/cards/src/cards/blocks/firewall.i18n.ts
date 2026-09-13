import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { firewall } from "./firewall.ts";

export const firewallI18n = defineFamilyI18n(firewall, {
  en: {
    name: "Firewall",
    text: "When this defends, reveal the top card of your deck. If it's an Evo, put it on top of your deck. Otherwise, put it on the bottom.",
    typeText: "Mechanologist Block",
  },
});

export const {
  red: firewallRedI18n,
  yellow: firewallYellowI18n,
  blue: firewallBlueI18n,
} = firewallI18n.cards;
