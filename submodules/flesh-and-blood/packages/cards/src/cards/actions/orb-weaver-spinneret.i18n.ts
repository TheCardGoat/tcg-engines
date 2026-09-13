import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { orbWeaverSpinneret } from "./orb-weaver-spinneret.ts";

export const orbWeaverSpinneretI18n = defineFamilyI18n(orbWeaverSpinneret, {
  en: {
    name: "Orb-Weaver Spinneret",
    text: "Equip a Graphene Chelicera token.\nYour next attack with stealth this turn gets +3{p}.\nGo again",
    typeText: "Assassin Action",
  },
});

export const {
  red: orbWeaverSpinneretRedI18n,
  yellow: orbWeaverSpinneretYellowI18n,
  blue: orbWeaverSpinneretBlueI18n,
} = orbWeaverSpinneretI18n.cards;
