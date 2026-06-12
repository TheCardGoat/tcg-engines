import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson, requestVoid } from "$lib/data/transport/http-client.js";
import type { ServerGameplaySettings } from "./player-settings-store.svelte.js";

export interface UserSettingsResponse {
  visualSettings?: {
    cardBack?: string;
    playmat?: string;
  };
  gameVisualSettings?: Record<
    string,
    {
      cardBack?: string;
      playmat?: string;
    }
  >;
  gameplaySettings?: ServerGameplaySettings;
}

interface UpdateUserVisualSettingsPayload {
  visualSettings: {
    cardBack?: string;
    playmat?: string;
  };
}

export async function fetchUserSettings(): Promise<UserSettingsResponse> {
  return requestJson<UserSettingsResponse>(
    `${getApiOrigin()}/v1/users/me/settings`,
    undefined,
    "Failed to load user settings",
  );
}

export async function updateUserSettings(payload: {
  gameplaySettings: Partial<ServerGameplaySettings>;
}): Promise<void> {
  await requestVoid(
    `${getApiOrigin()}/v1/users/me/settings`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Failed to save user settings",
  );
}

export async function updateUserVisualSettings(
  payload: UpdateUserVisualSettingsPayload,
): Promise<void> {
  const lorcanaVisualSettings = payload.visualSettings;
  await requestVoid(
    `${getApiOrigin()}/v1/users/me/settings`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visualSettings: lorcanaVisualSettings,
        gameVisualSettings: {
          lorcana: lorcanaVisualSettings,
        },
      }),
    },
    "Failed to save visual settings",
  );
}
