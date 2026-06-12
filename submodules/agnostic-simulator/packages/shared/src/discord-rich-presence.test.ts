import { beforeEach, describe, expect, mock, test } from "bun:test";
import {
  buildDiscordRichPresenceMatchUrl,
  buildPlayingGameActivity,
  clearDiscordPlayingGamePresence,
  isDiscordActivityLaunch,
  updateDiscordPlayingGamePresence,
} from "./discord-rich-presence";

describe("Discord Rich Presence helpers", () => {
  beforeEach(() => {
    Reflect.deleteProperty(globalThis, "location");
  });

  test("builds the requested game activity details", () => {
    expect(
      buildPlayingGameActivity({
        gameName: "Disney Lorcana",
        startedAtMs: 1_700_000_000_000,
        matchUrl: "https://tcg.online/lorcana/matches/m1/games/g1",
      }),
    ).toEqual({
      type: 0,
      details: "Playing Disney Lorcana on TCG.online",
      details_url: "https://tcg.online/lorcana/matches/m1/games/g1",
      state: "In a match",
      timestamps: {
        start: 1_700_000_000,
      },
    });
  });

  test("falls back to the current time when the start timestamp is invalid", () => {
    const realDateNow = Date.now;
    Date.now = () => 1_800_000_000_000;
    try {
      expect(
        buildPlayingGameActivity({
          gameName: "Gundam Card Game",
          startedAtMs: Number.NaN,
        }),
      ).toMatchObject({
        timestamps: {
          start: 1_800_000_000,
        },
      });
      expect(
        buildPlayingGameActivity({
          gameName: "Gundam Card Game",
          startedAtMs: Number.POSITIVE_INFINITY,
        }),
      ).toMatchObject({
        timestamps: {
          start: 1_800_000_000,
        },
      });
    } finally {
      Date.now = realDateNow;
    }
  });

  test("omits details_url when no valid TCG.online match URL is available", () => {
    expect(buildPlayingGameActivity({ gameName: "Cyberpunk 2077" })).not.toHaveProperty(
      "details_url",
    );
    expect(
      buildPlayingGameActivity({
        gameName: "Cyberpunk 2077",
        matchUrl: "javascript:alert(1)",
      }),
    ).not.toHaveProperty("details_url");
    expect(
      buildPlayingGameActivity({
        gameName: "Cyberpunk 2077",
        matchUrl: "https://example.com/match",
      }),
    ).not.toHaveProperty("details_url");
  });

  test("builds a sanitized public match URL for Discord details", () => {
    expect(
      buildDiscordRichPresenceMatchUrl(
        "https://tcg.online/cyberpunk/matches/m1/games/g1?ticket=t&authToken=a&playerId=p&frame_id=f&instance_id=i&platform=desktop#secret",
      ),
    ).toBe("https://tcg.online/cyberpunk/matches/m1/games/g1");
    expect(buildDiscordRichPresenceMatchUrl("https://evil.example/match?ticket=t")).toBeUndefined();
    expect(buildDiscordRichPresenceMatchUrl("not a url")).toBeUndefined();
  });

  test("detects Discord Activity launch parameters", () => {
    expect(
      isDiscordActivityLaunch(
        "https://tcg.online/lorcana/matches/m1/games/g1?frame_id=f&instance_id=i&platform=desktop",
      ),
    ).toBe(true);
    expect(isDiscordActivityLaunch("https://tcg.online/lorcana/matches/m1/games/g1")).toBe(false);
    expect(isDiscordActivityLaunch("not a url")).toBe(false);
    expect(isDiscordActivityLaunch("https://tcg.online/match?frame_id=f&instance_id=i")).toBe(
      false,
    );
    expect(isDiscordActivityLaunch("https://tcg.online/match?frame_id=f&platform=desktop")).toBe(
      false,
    );
  });

  test("skips presence updates outside a Discord Activity launch", async () => {
    setBrowserHref("https://tcg.online/match");

    await expect(
      updateDiscordPlayingGamePresence({
        clientId: "client-1",
        gameName: "Disney Lorcana",
      }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "outside-discord-activity",
    });
  });

  test("authenticates before setting presence", async () => {
    setBrowserHref("https://tcg.online/match?frame_id=f&instance_id=i&platform=desktop");
    const calls: string[] = [];
    const sdk = createMockSdk(calls);

    await expect(
      updateDiscordPlayingGamePresence({
        clientId: "client-1",
        exchangeAuthorizationCode: async ({ code }) => `token-for-${code}`,
        gameName: "Disney Lorcana",
        matchUrl: "https://tcg.online/lorcana/matches/m1/games/g1?ticket=secret",
        sdkFactory: () => sdk,
        startedAtMs: 1_700_000_000_000,
      }),
    ).resolves.toEqual({ ok: true });

    expect(calls).toEqual(["ready", "authorize", "authenticate:token-for-code-1", "setActivity"]);
    expect(sdk.commands.setActivity).toHaveBeenCalledWith({
      activity: {
        type: 0,
        details: "Playing Disney Lorcana on TCG.online",
        details_url: "https://tcg.online/lorcana/matches/m1/games/g1",
        state: "In a match",
        timestamps: {
          start: 1_700_000_000,
        },
      },
    });
  });

  test("skips missing token exchange before setting presence", async () => {
    setBrowserHref("https://tcg.online/match?frame_id=f&instance_id=i&platform=desktop");
    const calls: string[] = [];
    const sdk = createMockSdk(calls);

    const result = await updateDiscordPlayingGamePresence({
      clientId: "client-1",
      gameName: "Disney Lorcana",
      sdkFactory: () => sdk,
    });

    expect(result).toMatchObject({
      ok: false,
      skipped: true,
      reason: "access-token-unavailable",
    });
    expect(calls).toEqual(["ready", "authorize"]);
  });

  test("clears Discord presence through the authenticated command path", async () => {
    setBrowserHref("https://tcg.online/match?frame_id=f&instance_id=i&platform=desktop");
    const calls: string[] = [];
    const sdk = createMockSdk(calls);

    await expect(
      clearDiscordPlayingGamePresence({
        accessToken: "token-1",
        clientId: "client-1",
        sdkFactory: () => sdk,
      }),
    ).resolves.toEqual({ ok: true });

    expect(calls).toEqual(["ready", "authorize", "authenticate:token-1", "setActivity"]);
    expect(sdk.commands.setActivity).toHaveBeenCalledWith({ activity: null });
  });

  test("reports Discord ready timeouts", async () => {
    setBrowserHref("https://tcg.online/match?frame_id=f&instance_id=i&platform=desktop");
    const sdk = createMockSdk([]);
    sdk.ready = () => new Promise(() => undefined);

    const result = await updateDiscordPlayingGamePresence({
      accessToken: "token-1",
      clientId: "client-1",
      gameName: "Disney Lorcana",
      readyTimeoutMs: 1,
      sdkFactory: () => sdk,
    });

    expect(result).toMatchObject({
      ok: false,
      skipped: false,
      reason: "ready-timeout",
    });
  });
});

function setBrowserHref(href: string): void {
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: { href },
  });
}

function createMockSdk(calls: string[]) {
  return {
    ready: mock(async () => {
      calls.push("ready");
    }),
    commands: {
      authorize: mock(async () => {
        calls.push("authorize");
        return { code: "code-1" };
      }),
      authenticate: mock(async ({ access_token }: { readonly access_token?: string | null }) => {
        calls.push(`authenticate:${access_token ?? "missing"}`);
        return {
          access_token: access_token ?? "",
          application: {
            description: "",
            id: "app-1",
            name: "TCG.online",
          },
          expires: "2026-05-18T00:00:00.000Z",
          scopes: ["identify", "rpc.activities.write"] as const,
          user: {
            avatar: null,
            discriminator: "0",
            global_name: null,
            id: "user-1",
            public_flags: 0,
            username: "tester",
          },
        };
      }),
      setActivity: mock(async (input: { readonly activity: unknown }) => {
        calls.push("setActivity");
        return input.activity;
      }),
    },
  };
}
