import type { AcCommand, PlayerId } from "@tcg/alpha-clash-engine";
import type { InteractionAction } from "@tcg/protocol";
export type PlayDeclaration = NonNullable<Extract<AcCommand, { type: "resolveChoice" }>["play"]> &
  Pick<Extract<AcCommand, { type: "respond" }>, "healthReduction">;

/** Quotes and submissions use the same native entry point, including effect-play permissions. */
export function playActionCommand(
  action: Pick<InteractionAction, "id">,
  playerId: PlayerId,
  declaration: PlayDeclaration = {},
): AcCommand | undefined {
  const [type, first, ...rest] = action.id.split(":");
  if ((type === "playCard" || type === "respond") && first)
    return { ...declaration, type, playerId, cardId: first };
  if (type === "resolveEffectPlay" && first && rest.length)
    return {
      type: "resolveChoice",
      playerId,
      choiceId: first,
      optionId: rest.join(":"),
      play: declaration,
    };
}
