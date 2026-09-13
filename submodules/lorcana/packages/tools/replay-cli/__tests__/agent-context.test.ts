import { describe, expect, it, mock } from "bun:test";
import {
  AgentReplayContextNotFoundError,
  fetchAgentReplayContext,
  fetchAgentReplayContextMarkdown,
} from "../src/agent-context";

describe("persisted agent replay context", () => {
  it("uses the protected shared endpoint and parses the browser anchor", async () => {
    const fetchMock = mock(async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input));
      expect(url.pathname).toBe("/v1/play/replays/game%2F1/agent-context");
      expect(url.searchParams.get("turn")).toBe("14");
      expect(url.searchParams.get("format")).toBe("json");
      expect(url.searchParams.get("before")).toBe("0");
      expect(url.searchParams.get("after")).toBe("12");
      expect(new Headers(init?.headers).get("x-agent-replay-token")).toBe("agent-secret");
      return Response.json({ selectedWindow: { anchorStep: 42 } });
    });

    const context = await fetchAgentReplayContext(
      "game/1",
      14,
      "https://api.tcg.online",
      "agent-secret",
      { before: 0, after: 12 },
      fetchMock,
    );

    expect(context.selectedWindow.anchorStep).toBe(42);
  });

  it("returns markdown without exposing the token in the URL", async () => {
    const fetchMock = mock(async (input: string | URL | Request) => {
      expect(String(input)).not.toContain("agent-secret");
      return new Response("# Agent Replay Context\n", {
        headers: { "content-type": "text/markdown" },
      });
    });

    await expect(
      fetchAgentReplayContextMarkdown(
        "game-1",
        3,
        "https://api.tcg.online/",
        "agent-secret",
        {},
        fetchMock,
      ),
    ).resolves.toBe("# Agent Replay Context\n");
  });

  it("allows the CLI to fall back when persisted context is unavailable", async () => {
    const fetchMock = mock(async () => new Response(null, { status: 404 }));

    await expect(
      fetchAgentReplayContext(
        "missing",
        1,
        "https://api.tcg.online",
        "agent-secret",
        {},
        fetchMock,
      ),
    ).rejects.toBeInstanceOf(AgentReplayContextNotFoundError);
  });
});
