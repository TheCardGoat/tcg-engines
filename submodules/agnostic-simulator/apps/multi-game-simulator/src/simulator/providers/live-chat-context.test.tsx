import { MantineProvider } from "@mantine/core";
import { SimulatorActivityTabs } from "@tcg/simulator-ui";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LiveMatchChatPanel } from "../chat/LiveMatchChatPanel";
import { SimulatorLiveChatProvider } from "./live-chat-context";

const bus = vi.hoisted(() => ({ listeners: new Map<string, Set<(payload: unknown) => void>>() }));
vi.mock("../../lib/gateway/root-socket", () => ({
  acquireRootGatewayHandle: () => ({
    emit: vi.fn(),
    release: vi.fn(),
    on: (event: string, listener: (payload: unknown) => void) => {
      const listeners = bus.listeners.get(event) ?? new Set();
      listeners.add(listener);
      bus.listeners.set(event, listeners);
      return () => listeners.delete(listener);
    },
  }),
}));
afterEach(() => {
  cleanup();
  bus.listeners.clear();
});
it("retains a received chat message after visiting Log and returning to Chat", () => {
  render(
    <MantineProvider>
      <SimulatorLiveChatProvider gameSlug="flesh-and-blood" gameId="game-1" viewerId="p2">
        <SimulatorActivityTabs
          log={<p>Game log</p>}
          defaultTab="log"
          chat={<LiveMatchChatPanel />}
        />
      </SimulatorLiveChatProvider>
    </MantineProvider>,
  );
  fireEvent.click(screen.getByRole("tab", { name: "Chat" }));
  act(() => {
    for (const listener of bus.listeners.get("chat_message") ?? [])
      listener({
        gameId: "game-1",
        message: {
          id: "message-1",
          kind: "text",
          senderPlayerId: "p1",
          createdAt: new Date().toISOString(),
          text: "Please wait while I read this card.",
        },
      });
  });
  expect(screen.getByText("Please wait while I read this card.")).toBeTruthy();
  fireEvent.click(screen.getByRole("tab", { name: "Log" }));
  fireEvent.click(screen.getByRole("tab", { name: "Chat" }));
  expect(screen.queryByText("Please wait while I read this card.")).not.toBeNull();
});

it("receives messages before Chat is first opened and isolates the next game", () => {
  const view = (gameId: string) => (
    <MantineProvider>
      <SimulatorLiveChatProvider gameSlug="naruto" gameId={gameId} viewerId="p2">
        <SimulatorActivityTabs log={<p>Log</p>} defaultTab="log" chat={<LiveMatchChatPanel />} />
      </SimulatorLiveChatProvider>
    </MantineProvider>
  );
  const { rerender } = render(view("game-1"));
  act(() => {
    for (const listener of bus.listeners.get("chat_message") ?? [])
      listener({
        gameId: "game-1",
        message: {
          id: "thinking",
          kind: "preset",
          senderPlayerId: "p1",
          createdAt: new Date().toISOString(),
          presetKey: "thinking",
        },
      });
  });
  fireEvent.click(screen.getByRole("tab", { name: "Chat" }));
  expect(screen.getByRole("log").textContent).toContain("Thinking...");
  rerender(view("game-2"));
  fireEvent.click(screen.getByRole("tab", { name: "Chat" }));
  expect(screen.getByRole("log").textContent).not.toContain("Thinking...");
});

it("restores chat history received while closed and deduplicates delivery", () => {
  render(
    <MantineProvider>
      <SimulatorLiveChatProvider gameSlug="naruto" gameId="game-1" viewerId="p2">
        <SimulatorActivityTabs log={<p>Log</p>} defaultTab="log" chat={<LiveMatchChatPanel />} />
      </SimulatorLiveChatProvider>
    </MantineProvider>,
  );
  const message = {
    id: "restored",
    kind: "text",
    senderPlayerId: "p1",
    createdAt: new Date().toISOString(),
    text: "Restored after reconnect",
  };
  act(() => {
    for (const listener of bus.listeners.get("game_chat_history") ?? [])
      listener({
        gameId: "game-1",
        messages: [message],
        freeTextEnabled: true,
      });
    for (const listener of bus.listeners.get("chat_message") ?? [])
      listener({ gameId: "game-1", message });
    for (const listener of bus.listeners.get("chat_message") ?? [])
      listener({
        gameId: "another-game",
        message: { ...message, id: "foreign", text: "Wrong game" },
      });
  });
  fireEvent.click(screen.getByRole("tab", { name: "Chat" }));
  expect(screen.getAllByText("Restored after reconnect")).toHaveLength(1);
  expect(screen.queryByText("Wrong game")).toBeNull();
  expect(screen.getByRole("textbox")).toBeTruthy();
});

it("ignores malformed timestamps and renders shared system copy with sending disabled", () => {
  render(
    <MantineProvider>
      <SimulatorLiveChatProvider
        gameSlug="naruto"
        gameId="game-1"
        viewerId="p1"
        initialMessages={[
          {
            id: "bad",
            kind: "text",
            senderPlayerId: "p2",
            text: "Invalid date",
            createdAt: "not-a-date",
          },
          {
            id: "system",
            kind: "system",
            systemEvent: "undo_declined",
            createdAt: "2026-09-24T10:00:00Z",
          },
        ]}
      >
        <LiveMatchChatPanel canSend={false} />
      </SimulatorLiveChatProvider>
    </MantineProvider>,
  );
  expect(screen.queryByText("Invalid date")).toBeNull();
  expect(screen.getByText("Undo request rejected.")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Good luck!" }).hasAttribute("disabled")).toBe(true);
});
