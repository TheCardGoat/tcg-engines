import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { onePieceServerAdapter } from "./adapter";

export { onePieceServerAdapter } from "./adapter";
export { OnePieceServerEngine } from "./one-piece-server-engine";
export { buildOnePieceInteractionView, onePieceSubmissionToPayload } from "./interaction-protocol";

export function registerOnePieceServerAdapter(): void {
  registerGameAdapter(onePieceServerAdapter);
}
