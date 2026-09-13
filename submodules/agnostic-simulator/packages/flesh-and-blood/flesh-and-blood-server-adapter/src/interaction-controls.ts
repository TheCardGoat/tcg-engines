import type { InteractionAction } from "@tcg/protocol";
import type { FabLegalCommand } from "@tcg/flesh-and-blood-engine/legal-commands";

/** Native control identity stays in the FAB adapter; protocol ids remain opaque. */
export type FabInteractionControl =
  | { readonly kind: "pass" }
  | { readonly kind: "end-turn" }
  | { readonly kind: "defend" };

export function fabControlActionId(command: FabLegalCommand): string | null {
  switch (command.move) {
    case "pass":
      return "fab:control:pass";
    case "end-turn":
      return command.payload.chooseArsenal === true ? "fab:control:end-turn" : null;
    default:
      return null;
  }
}

export function fabInteractionControl(action: InteractionAction): FabInteractionControl | null {
  if (action.id === "fab:control:pass") return { kind: "pass" };
  if (action.id === "fab:control:end-turn") return { kind: "end-turn" };
  if (action.id === "fab:control:defend") return { kind: "defend" };
  return null;
}
