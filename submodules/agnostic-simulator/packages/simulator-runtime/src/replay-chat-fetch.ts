import { ReplayChatMessageSchema, type ReplayPlaybackV1 } from "@tcg/game-page-contract";
import { z } from "zod";

const ReplayChatResponseSchema = z.object({
  object: z.literal("replay_chat"),
  data: z.array(ReplayChatMessageSchema),
});

/** Player chat lives on a private sibling of the public playback URL. */
export function replayChatUrl(playbackUrl: string): string {
  const hashIndex = playbackUrl.indexOf("#");
  const withoutHash = hashIndex === -1 ? playbackUrl : playbackUrl.slice(0, hashIndex);
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex);
  const suffix = queryIndex === -1 ? "" : withoutHash.slice(queryIndex);
  return `${path.replace(/\/$/, "")}/chat${suffix}`;
}

/**
 * Drop chat baked into a public playback body, then attach the participant
 * route when this viewer is allowed to read it. A failed read leaves chat
 * absent so a later load can retry.
 */
export async function withParticipantReplayChat(
  playback: ReplayPlaybackV1,
  playbackUrl: string,
  fetcher: typeof fetch,
  signal?: AbortSignal,
): Promise<ReplayPlaybackV1> {
  const { chatMessages: _bakedChat, ...publicPlayback } = playback;
  try {
    const response = await fetcher(replayChatUrl(playbackUrl), {
      credentials: "include",
      headers: { Accept: "application/json" },
      signal,
    });
    if (!response.ok) return publicPlayback;
    const parsed = ReplayChatResponseSchema.safeParse(await response.json());
    if (!parsed.success) return publicPlayback;
    return { ...publicPlayback, chatMessages: parsed.data.data };
  } catch {
    return publicPlayback;
  }
}
