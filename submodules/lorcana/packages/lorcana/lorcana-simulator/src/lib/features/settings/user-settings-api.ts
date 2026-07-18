import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson, requestVoid } from "$lib/data/transport/http-client.js";
import type { ServerGameplaySettings } from "./player-settings-store.svelte.js";

export interface UserSettingsResponse {
  playerSettings?: ServerGameplaySettings;
  gameSettings?: {
    lorcana?: {
      visual?: { cardBackId?: string; playmatId?: string };
      simulator?: Pick<
        ServerGameplaySettings,
        "primaryClickAction" | "cardInfoMode" | "priorityNudgeEnabled"
      >;
    };
  };
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
  gameSettings: {
    lorcana: { visual: { cardBackId?: string; playmatId?: string } };
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
  playerSettings?: Partial<ServerGameplaySettings>;
  gameSettings?: UserSettingsResponse["gameSettings"];
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
  await requestVoid(
    `${getApiOrigin()}/v1/users/me/settings`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Failed to save visual settings",
  );
}
