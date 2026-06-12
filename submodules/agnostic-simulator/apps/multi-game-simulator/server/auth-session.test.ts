import { describe, expect, it, vi } from "vitest";
import { parsePlatformAuthSession, resolvePlatformAuthSession } from "./auth-session.js";
import type { SessionResult } from "../src/games/cyberpunk/auth/platform-session.js";

const platformSessionWithDates: SessionResult = {
  user: {
    id: "user_1",
    email: "player@example.com",
    name: "Player",
    image: null,
    username: null,
    displayUsername: "Player",
    emailVerified: true,
    role: "user",
    subscriptionTier: "free",
    subscriptionExpiresAt: null,
    createdAt: new Date("2026-05-17T00:00:00.000Z"),
    updatedAt: new Date("2026-05-17T00:00:00.000Z"),
  },
  session: {
    id: "session_1",
    userId: "user_1",
    token: "token_1",
    expiresAt: new Date("2026-05-18T00:00:00.000Z"),
    ipAddress: null,
    userAgent: null,
    createdAt: new Date("2026-05-17T00:00:00.000Z"),
    updatedAt: new Date("2026-05-17T00:00:00.000Z"),
  },
};

const platformSession = JSON.parse(JSON.stringify(platformSessionWithDates)) as SessionResult;

describe("parsePlatformAuthSession", () => {
  it("accepts the platform Better Auth session shape", () => {
    expect(parsePlatformAuthSession(platformSession)).toEqual(platformSession);
  });

  it("rejects malformed session payloads", () => {
    expect(
      parsePlatformAuthSession({ user: { id: "user_1" }, session: platformSession.session }),
    ).toBeNull();
    expect(
      parsePlatformAuthSession({ user: platformSession.user, session: { id: "session_1" } }),
    ).toBeNull();
    expect(parsePlatformAuthSession(null)).toBeNull();
  });
});

describe("resolvePlatformAuthSession", () => {
  it("skips the platform auth service when no cookie is present", async () => {
    const fetcher = vi.fn<typeof fetch>();

    await expect(
      resolvePlatformAuthSession({
        request: new Request("https://tcg.online/cyberpunk/simulator/"),
        fetcher,
        sessionUrl: "http://general-api.internal/api/auth/get-session",
      }),
    ).resolves.toBeNull();

    expect(fetcher).not.toHaveBeenCalled();
  });

  it("forwards cookies and host metadata to the platform auth service", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => Response.json(platformSession));

    await expect(
      resolvePlatformAuthSession({
        request: new Request("https://tcg.online/cyberpunk/simulator/", {
          headers: { cookie: "better-auth.session_token=abc" },
        }),
        fetcher,
        sessionUrl: "http://general-api.internal/api/auth/get-session",
      }),
    ).resolves.toEqual(platformSession);

    expect(fetcher).toHaveBeenCalledWith(
      "http://general-api.internal/api/auth/get-session",
      expect.objectContaining({
        headers: {
          cookie: "better-auth.session_token=abc",
          "x-forwarded-host": "tcg.online",
          "x-forwarded-proto": "https",
        },
        redirect: "manual",
      }),
    );
  });
});
