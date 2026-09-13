import type { PostGameRecordEnvelope } from "./notes-api.js";

export const POST_GAME_RECORD_RETRY_DELAY_MS = 250;
export const MAX_POST_GAME_RECORD_RETRIES = 8;

export function isPostGameRecordFresh(
  record: PostGameRecordEnvelope,
  minimumStateId: number | null,
): boolean {
  if (minimumStateId === null || !record.postGame) {
    return true;
  }

  return record.postGame.board.stateID >= minimumStateId;
}

export async function loadFreshPostGameRecord(params: {
  gameId: string;
  minimumStateId: number | null;
  loadRecord: (gameId: string) => Promise<PostGameRecordEnvelope>;
  maxRetries?: number;
  retryDelayMs?: number;
  sleep?: (delayMs: number) => Promise<void>;
}): Promise<PostGameRecordEnvelope> {
  const maxRetries = params.maxRetries ?? MAX_POST_GAME_RECORD_RETRIES;
  const retryDelayMs = params.retryDelayMs ?? POST_GAME_RECORD_RETRY_DELAY_MS;
  const sleep = params.sleep ?? ((delayMs) => new Promise<void>((resolve) => setTimeout(resolve, delayMs)));
  let record = await params.loadRecord(params.gameId);

  for (
    let attempt = 0;
    !isPostGameRecordFresh(record, params.minimumStateId) && attempt < maxRetries;
    attempt += 1
  ) {
    await sleep(retryDelayMs);
    record = await params.loadRecord(params.gameId);
  }

  return record;
}
