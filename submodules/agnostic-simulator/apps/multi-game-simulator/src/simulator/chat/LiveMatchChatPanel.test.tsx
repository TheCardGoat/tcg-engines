import { MantineProvider } from "@mantine/core";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimulatorLiveChatProvider } from "../providers/live-chat-context";
import { LiveMatchChatPanel } from "./LiveMatchChatPanel";

const gateway = vi.hoisted(() => ({
  emit: vi.fn(),
  release: vi.fn(),
  on: vi.fn(),
}));
vi.mock("../../lib/gateway/root-socket", () => ({ acquireRootGatewayHandle: () => gateway }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

gateway.on.mockImplementation(() => vi.fn());

describe("LiveMatchChatPanel", () => {
  it("shows a received thinking preset in the ordinary chat log", () => {
    render(
      <MantineProvider>
        <SimulatorLiveChatProvider gameSlug="naruto" gameId="game-1" viewerId="p2">
          <LiveMatchChatPanel />
        </SimulatorLiveChatProvider>
      </MantineProvider>,
    );
    const onChat = gateway.on.mock.calls.find(([event]) => event === "chat_message")?.[1];
    if (!onChat) throw new Error("Missing chat listener");
    act(() =>
      onChat({
        gameId: "game-1",
        message: {
          id: "m1",
          kind: "preset",
          presetKey: "thinking",
          senderPlayerId: "p1",
          createdAt: new Date().toISOString(),
        },
      }),
    );
    expect(screen.getByRole("log", { name: "Chat messages" }).textContent).toContain("Thinking...");
    expect(screen.queryByText("Your opponent is thinking.")).toBeNull();
  });

  it("uses the normal chat send event for a preset", () => {
    render(
      <MantineProvider>
        <SimulatorLiveChatProvider gameSlug="naruto" gameId="game-1" viewerId="p2">
          <LiveMatchChatPanel />
        </SimulatorLiveChatProvider>
      </MantineProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Thinking..." }));
    expect(gateway.emit).toHaveBeenCalledWith("send_chat_message", {
      gameId: "game-1",
      presetKey: "thinking",
    });
  });
});
