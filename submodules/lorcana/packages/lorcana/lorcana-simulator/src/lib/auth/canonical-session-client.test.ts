import { afterEach, describe, expect, it, mock } from "bun:test";
import { publicEnv } from "../../testing/public-env";
import { fetchCanonicalSession, parseCanonicalSession } from "./canonical-session-client";

const canonicalResponse = {
  status: "authenticated",
  user: {
    id: "user-1",
    name: "Player One",
    email: "private@example.com",
    emailVerified: true,
    image: null,
    username: "player-one",
    displayUsername: "Player One",
    role: "user",
    subscriptionTier: "free",
    subscriptionExpiresAt: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  session: {
    id: "session-1",
    userId: "user-1",
    token: "session-token",
    expiresAt: "2026-02-01T00:00:00.000Z",
    ipAddress: null,
    userAgent: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
};

afterEach(() => {
  delete publicEnv.PUBLIC_API_URL;
});

describe("canonical session client", () => {
  it("uses the canonical endpoint and drops unapproved response keys", async () => {
    publicEnv.PUBLIC_API_URL = "https://api.example.com/v1";
    const fetcher = mock(async () => Response.json(canonicalResponse));

    const result = await fetchCanonicalSession(fetcher);

    expect(fetcher).toHaveBeenCalledWith("https://api.example.com/v1/auth/session", {
      credentials: "include",
    });
    expect(result?.user.id).toBe("user-1");
    expect(result?.user.createdAt).toBeInstanceOf(Date);
    expect(result?.user).not.toHaveProperty("email");
    expect(JSON.stringify(result)).not.toContain("private@example.com");
  });

  it("rejects malformed or mismatched authenticated identities", () => {
    expect(
      parseCanonicalSession({
        ...canonicalResponse,
        session: { ...canonicalResponse.session, userId: "another-user" },
      }),
    ).toBeNull();
    expect(
      parseCanonicalSession({
        ...canonicalResponse,
        user: { ...canonicalResponse.user, createdAt: "not-a-date" },
      }),
    ).toBeNull();
  });

  it("treats anonymous and invalid canonical states as signed out", () => {
    expect(parseCanonicalSession({ status: "anonymous", user: null, session: null })).toBeNull();
    expect(
      parseCanonicalSession({
        status: "invalid",
        reason: "canonical_user_missing",
        user: null,
        session: null,
      }),
    ).toBeNull();
  });
});
