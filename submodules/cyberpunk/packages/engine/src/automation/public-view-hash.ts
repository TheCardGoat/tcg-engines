import { stableBotHash } from "@tcg/bot-core";

/** Public-board fingerprint used to detect a chooser walking the same view. */
export function semanticViewHash(view: unknown): string {
  return stableBotHash(
    JSON.parse(
      JSON.stringify(view, (key, value) =>
        key === "stateID" || key === "_stateID" ? undefined : value,
      ),
    ),
  );
}
