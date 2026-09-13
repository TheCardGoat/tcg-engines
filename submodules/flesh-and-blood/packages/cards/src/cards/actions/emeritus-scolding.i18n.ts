import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { emeritusScolding } from "./emeritus-scolding.ts";

export const emeritusScoldingI18n = defineFamilyI18n(emeritusScolding, {
  en: {
    name: "Emeritus Scolding",
    text: ({ damage, opponentDamage }) =>
      `Deal ${damage} arcane damage to target hero. If Emeritus Scolding is played during an opponents turn, instead deal ${opponentDamage} arcane damage to them.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: emeritusScoldingRedI18n,
  yellow: emeritusScoldingYellowI18n,
  blue: emeritusScoldingBlueI18n,
} = emeritusScoldingI18n.cards;
