import { mock } from "bun:test";

export const publicEnv: Record<string, string | undefined> = {};

mock.module("$env/dynamic/public", () => ({
  env: publicEnv,
}));
