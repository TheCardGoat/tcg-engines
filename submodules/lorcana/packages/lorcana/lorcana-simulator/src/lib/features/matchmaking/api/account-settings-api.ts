import { getApiOrigin } from "$lib/config/public-url-config.js";
import { HttpRequestError, requestJson, requestVoid } from "$lib/data/transport/http-client.js";

export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  username: string | null;
  displayUsername: string | null;
  role: string;
  subscriptionTier: string;
  region: string | null;
  country: string | null;
  createdAt: string;
  linkedAccounts: Array<{ providerId: string; accountId: string }>;
}

export interface UpdateAccountProfileInput {
  region?: string;
  country?: string;
}

export async function fetchAccountProfile(): Promise<AccountProfile> {
  return requestJson<AccountProfile>(
    `${getApiOrigin()}/v1/users/me`,
    undefined,
    "Failed to load profile",
  );
}

export async function updateAccountProfile(
  data: UpdateAccountProfileInput,
): Promise<{ success: true } | { success: false; status: number; message: string }> {
  try {
    await requestVoid(
      `${getApiOrigin()}/v1/users/me`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      "Failed to update profile",
    );
    return { success: true };
  } catch (error) {
    if (error instanceof HttpRequestError) {
      return {
        success: false,
        status: error.status,
        message: error.message,
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to update profile",
    };
  }
}

export async function syncLegacyAccount(
  gameSlug: string,
): Promise<{ success: true } | { success: false; status: number; message: string }> {
  try {
    await requestVoid(
      `${getApiOrigin()}/v1/users/me/games/${gameSlug}/onboard`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsAccepted: true, forceReimport: true }),
      },
      "Failed to sync account",
    );
    return { success: true };
  } catch (error) {
    if (error instanceof HttpRequestError) {
      return {
        success: false,
        status: error.status,
        message: error.message,
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to sync account",
    };
  }
}

export async function updateProfileDisplayName(
  gameProfileId: string,
  displayName: string,
): Promise<{ success: true } | { success: false; status: number; message: string }> {
  try {
    await requestVoid(
      `${getApiOrigin()}/v1/users/me/games/lorcana/profiles/${gameProfileId}/display-name`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      },
      "Failed to update display name",
    );
    return { success: true };
  } catch (error) {
    if (error instanceof HttpRequestError) {
      return {
        success: false,
        status: error.status,
        message: error.message,
      };
    }
    return {
      success: false,
      status: 500,
      message: "Failed to update display name",
    };
  }
}
