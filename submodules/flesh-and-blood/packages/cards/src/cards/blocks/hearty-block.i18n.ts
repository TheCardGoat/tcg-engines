import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heartyBlock } from "./hearty-block.ts";

export const heartyBlockI18n = defineFamilyI18n(heartyBlock, {
  en: {
    name: "Hearty Block",
    text: "When this defends, if you control a Vigor token, gain 1{h}.",
    typeText: "Guardian / Warrior Block",
  },
});

export const { red: heartyBlockRedI18n } = heartyBlockI18n.cards;
