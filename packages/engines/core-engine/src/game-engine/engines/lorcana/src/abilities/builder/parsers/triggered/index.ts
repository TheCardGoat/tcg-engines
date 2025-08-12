import { parseOnBanish } from "./onBanish";
import { parseOnChallenge } from "./onChallenge";
import { parseOnPlay } from "./onPlay";
import { parseOnQuest } from "./onQuest";
import { parseEndOfTurn, parseStartOfTurn } from "./timing";

export function parseTriggered(text: string) {
  return (
    parseOnPlay(text) ||
    parseOnQuest(text) ||
    parseOnBanish(text) ||
    parseOnChallenge(text) ||
    parseStartOfTurn(text) ||
    parseEndOfTurn(text) ||
    null
  );
}
