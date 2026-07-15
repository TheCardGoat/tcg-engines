import { describe, expect, it, vi } from "vitest";
import { parsePlatformAuthSession, resolvePlatformAuthSession } from "./auth-session.js";
import type { SessionResult } from "@tcg/shared/auth";

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
    expect(parsePlatformAuthSession(platformSession)).toEqual(platformSessionWithDates);
  });

  it("accepts the minimum user id and session token needed for gateway auth", () => {
    expect(
      parsePlatformAuthSession({
        user: { id: "user_1" },
        session: { token: "session_token_1" },
      }),
    ).toMatchObject({
      user: {
        id: "user_1",
        role: "user",
        subscriptionTier: "free",
      },
      session: {
        id: "session:user_1",
        userId: "user_1",
        token: "session_token_1",
      },
    });
  });

  it("rejects malformed session payloads", () => {
    expect(parsePlatformAuthSession({ user: {}, session: platformSession.session })).toBeNull();
    expect(
      parsePlatformAuthSession({ user: platformSession.user, session: { id: "session_1" } }),
    ).toBeNull();
    expect(parsePlatformAuthSession(null)).toBeNull();
  });

  it("coerces optional untrusted fields to the runtime contract", () => {
    expect(
      parsePlatformAuthSession({
        user: {
          id: "user_1",
          image: ["not", "a", "string"],
          username: 123,
          displayUsername: { value: "Player" },
          subscriptionExpiresAt: "2026-06-01T00:00:00.000Z",
        },
        session: {
          token: "session_token_1",
          ipAddress: ["127.0.0.1"],
          userAgent: { name: "browser" },
        },
      }),
    ).toMatchObject({
      user: {
        image: null,
        username: null,
        displayUsername: null,
        subscriptionExpiresAt: new Date("2026-06-01T00:00:00.000Z"),
      },
      session: {
        ipAddress: null,
        userAgent: null,
      },
    });
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
    ).resolves.toEqual({ status: "session_missing", reason: "no_cookie" });

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
    ).resolves.toEqual({ status: "ready", session: platformSessionWithDates });

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

  it("reports non-OK session responses", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => new Response("unauthorized", { status: 401 }));

    await expect(
      resolvePlatformAuthSession({
        request: new Request("https://tcg.online/cyberpunk/simulator/", {
          headers: { cookie: "better-auth.session_token=abc" },
        }),
        fetcher,
        sessionUrl: "http://general-api.internal/api/auth/get-session",
      }),
    ).resolves.toEqual({
      status: "session_missing",
      reason: "auth_endpoint_non_ok",
      httpStatus: 401,
    });
  });

  it("reports malformed session payloads", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => Response.json({ user: { id: "user_1" } }));

    await expect(
      resolvePlatformAuthSession({
        request: new Request("https://tcg.online/cyberpunk/simulator/", {
          headers: { cookie: "better-auth.session_token=abc" },
        }),
        fetcher,
        sessionUrl: "http://general-api.internal/api/auth/get-session",
      }),
    ).resolves.toEqual({ status: "auth_parse_failed", reason: "malformed_payload" });
  });

  it("reports Better Auth null session responses as missing sessions", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => Response.json(null));

    await expect(
      resolvePlatformAuthSession({
        request: new Request("https://tcg.online/cyberpunk/simulator/", {
          headers: { cookie: "better-auth.session_token=abc" },
        }),
        fetcher,
        sessionUrl: "http://general-api.internal/api/auth/get-session",
      }),
    ).resolves.toEqual({ status: "session_missing", reason: "no_session" });
  });

  it("reports invalid JSON session responses as missing sessions", async () => {
    const fetcher = vi.fn<typeof fetch>(
      async () => new Response("{", { headers: { "content-type": "application/json" } }),
    );

    await expect(
      resolvePlatformAuthSession({
        request: new Request("https://tcg.online/cyberpunk/simulator/", {
          headers: { cookie: "better-auth.session_token=abc" },
        }),
        fetcher,
        sessionUrl: "http://general-api.internal/api/auth/get-session",
      }),
    ).resolves.toEqual({ status: "session_missing", reason: "no_session" });
  });
});
