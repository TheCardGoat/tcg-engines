import type { LorcanaEffect } from "../../effect-types";
import type { CardTarget } from "../../targets/card-target";
import type { PlayerTarget } from "../../targets/player-target";
import { PATTERNS } from "./util";

export default function parseSimpleEffects(
  effectText: string,
): LorcanaEffect[] {
  const effects: LorcanaEffect[] = [];

  const selfPlayerTarget: PlayerTarget = { type: "player", value: "self" };
  const chosenCharacterTarget: CardTarget = {
    type: "card",
    cardType: "character",
    count: 1,
  };

  const loreMatch = effectText.match(PATTERNS.GAIN_LORE);
  if (loreMatch) {
    effects.push({
      type: "gainLore",
      parameters: {
        value: Number.parseInt(loreMatch[1], 10),
        target: selfPlayerTarget,
      },
      optional: false,
    });
  }

  const drawMatch = effectText.match(PATTERNS.DRAW_CARDS);
  if (drawMatch) {
    const amount = drawMatch[1] ? Number.parseInt(drawMatch[1], 10) : 1;
    effects.push({
      type: "draw",
      parameters: { value: amount, target: selfPlayerTarget },
      optional: false,
    });
  }

  const damageMatch = effectText.match(PATTERNS.DEAL_DAMAGE);
  if (damageMatch) {
    effects.push({
      type: "dealDamage",
      parameters: { value: Number.parseInt(damageMatch[1], 10) },
      targets: [chosenCharacterTarget],
      optional: false,
    });
  }

  const statMatch = effectText.match(PATTERNS.BOOST_STAT);
  if (statMatch) {
    const [, valueStr, statLetter] = statMatch;
    const value = Number.parseInt(valueStr, 10);
    const statMap = { S: "strength", W: "willpower", L: "lore" } as const;
    const stat = statMap[statLetter as keyof typeof statMap];

    effects.push({
      type: "modifyStat",
      parameters: { attribute: stat, value },
      targets: [chosenCharacterTarget],
      duration: effectText.includes("this turn")
        ? { type: "endOfTurn" }
        : undefined,
      optional: false,
    });
  }

  if (effects.length === 0) {
    effects.push({ type: "multiEffect", parameters: { effects: [] } });
  }

  if (effectText.includes("this turn")) {
    effects.forEach((effect) => {
      if (!effect.duration) effect.duration = { type: "endOfTurn" } as any;
    });
  }

  return effects;
}
