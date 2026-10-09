import type { CardInstanceId } from "#core";
import type { LorcanaCardMeta } from "../../types";
import { hasTemporaryAbility } from "../effects/temporary-effects";

/** CR 4.6.4.5–4.6.9.2: protection spans the whole challenge, for the attacker only. */
export function preventsDamageWhileChallenging(
  meta: LorcanaCardMeta,
  turn: number,
  attackerId: CardInstanceId | undefined,
  targetId: CardInstanceId,
): boolean {
  return (
    attackerId === targetId && hasTemporaryAbility(meta, turn, "takes-no-damage-while-challenging")
  );
}
