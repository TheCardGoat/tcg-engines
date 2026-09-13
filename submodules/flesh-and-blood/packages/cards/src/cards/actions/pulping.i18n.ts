import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pulping } from "./pulping.ts";

export const pulpingI18n = defineFamilyI18n(pulping, {
  en: {
    name: "Pulping",
    text: "When this attacks, draw a card then discard a random card. If a card with 6 or more {p} is discarded this way, this gets dominate.\nIf this is defended by fewer than 2 non-equipment cards, it gets go again.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: pulpingRedI18n,
  yellow: pulpingYellowI18n,
  blue: pulpingBlueI18n,
} = pulpingI18n.cards;
