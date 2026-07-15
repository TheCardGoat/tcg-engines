import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestVoid } from "$lib/data/transport/http-client.js";

export async function joinDiscordGuild(): Promise<void> {
  await requestVoid(
    `${getApiOrigin()}/v1/discord/join-guild`,
    {
      method: "POST",
    },
    "Failed to join Discord guild",
  );
}
