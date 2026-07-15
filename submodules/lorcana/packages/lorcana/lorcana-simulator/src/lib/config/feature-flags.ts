import { env } from "$env/dynamic/public";

export interface FeatureFlags {
  rankedEnabled: boolean;
  testingQueueEnabled: boolean;
  testingQueueAccountIds: ReadonlySet<string>;
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function parseAccountIds(value: string | undefined): ReadonlySet<string> {
  if (!value) return EMPTY_SET;
  const ids = value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return ids.length > 0 ? new Set(ids) : EMPTY_SET;
}

const EMPTY_SET: ReadonlySet<string> = new Set();

export function getFeatureFlags(): FeatureFlags {
  return {
    rankedEnabled: parseBoolean(env.PUBLIC_RANKED_ENABLED),
    testingQueueEnabled: parseBoolean(env.PUBLIC_TESTING_QUEUE_ENABLED),
    testingQueueAccountIds: parseAccountIds(env.PUBLIC_TESTING_QUEUE_ACCOUNT_IDS),
  };
}
