// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import { GundamChatProvider, type GundamChatRemoteWiring } from "../../game/chat-context.tsx";
import type { GundamChatMessage } from "../../game/chat.ts";
import { MatchSidebar } from "./MatchSidebar.tsx";
import type { PlayerInfo } from "./types.ts";

afterEach(cleanup);

const PLAYERS: readonly [PlayerInfo, PlayerInfo] = [
  { name: "rival", shields: 4, resourcesAvailable: 2, resourcesTotal: 3, deck: 30, discard: 2 },
  { name: "pilot", shields: 5, resourcesAvailable: 3, resourcesTotal: 3, deck: 31, discard: 1 },
];

const EVENT_LOG_ENTRIES: readonly SimulatorEventLogEntry[] = [
  {
    id: "entry-1",
    turn: 1,
    phase: "main-phase",
    timestamp: new Date().toISOString(),
    message: "pilot started the turn.",
    tags: ["system"],
  },
];

function renderSidebar(chat: GundamChatRemoteWiring = {}) {
  return render(
    <GundamChatProvider {...chat}>
      <MatchSidebar
        players={PLAYERS}
        controlState={{ kind: "interactive", turnOwner: "self", priorityHolder: "self" }}
        log={[]}
        eventLogEntries={EVENT_LOG_ENTRIES}
        actions={{
          undo: <button type="button">Undo</button>,
          primary: <button type="button">Pass turn</button>,
          danger: <button type="button">Concede</button>,
        }}
      />
    </GundamChatProvider>,
  );
}

describe("Gundam sidebar activity", () => {
  it("keeps hosted chat in the dedicated Chat tab", async () => {
    const sendPreset = vi.fn(() => true);
    const requestFreeText = vi.fn(() => true);
    const remoteChatMessages: readonly GundamChatMessage[] = [
      {
        id: 1,
        kind: "preset",
        senderSide: "opponent",
        presetKey: "good_luck",
        timestamp: Date.now(),
      },
      {
        id: 2,
        kind: "text",
        senderSide: "player",
        text: "Ready when you are.",
        timestamp: Date.now() + 1,
      },
    ];
    renderSidebar({
      remoteChatMessages,
      remoteFreeTextEnabled: false,
      canRequestFreeText: true,
      sendRemoteChatPreset: sendPreset,
      requestRemoteFreeTextChat: requestFreeText,
    });

    expect(screen.getByText("pilot started the turn.")).toBeTruthy();
    expect(screen.queryByTestId("chat-message")).toBeNull();
    fireEvent.click(screen.getByRole("tab", { name: "Chat" }));

    const chatMessages = await screen.findAllByTestId("chat-message");
    expect(chatMessages).toHaveLength(2);
    expect(chatMessages[0]?.textContent).toContain("Good luck!");
    expect(chatMessages[1]?.textContent).toContain("Ready when you are.");
    fireEvent.click(screen.getAllByTestId("chat-quick")[0]!);
    expect(sendPreset).toHaveBeenCalledWith("good_luck");
    fireEvent.click(screen.getByTestId("chat-request-free-text"));
    expect(requestFreeText).toHaveBeenCalledTimes(1);
  });

  it("sends local preset and free-text messages without replacing the battle log", async () => {
    renderSidebar();

    fireEvent.click(screen.getByRole("tab", { name: "Chat" }));
    fireEvent.click((await screen.findAllByTestId("chat-quick"))[0]!);
    expect(screen.getByTestId("chat-message").textContent).toContain("Good luck!");

    const input = screen.getByTestId("chat-input");
    fireEvent.change(input, { target: { value: "  For the Federation!  " } });
    fireEvent.click(screen.getByTestId("chat-send"));
    expect(screen.getAllByTestId("chat-message")[1]?.textContent).toContain("For the Federation!");

    fireEvent.click(screen.getByRole("tab", { name: "Log" }));
    expect(screen.getByText("pilot started the turn.")).toBeTruthy();
    expect(screen.queryByTestId("chat-message")).toBeNull();
  });
});
