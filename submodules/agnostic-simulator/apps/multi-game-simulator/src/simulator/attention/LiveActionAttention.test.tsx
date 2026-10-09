import { MantineProvider } from "@mantine/core";
import { EngineInteractionView, INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LiveActionAttention } from "./LiveActionAttention";

const gateway = vi.hoisted(() => ({
  emit: vi.fn(),
  release: vi.fn(),
  on: vi.fn(),
}));
vi.mock("../../lib/gateway/root-socket", () => ({
  acquireRootGatewayHandle: () => gateway,
}));
vi.mock("@tcg/simulator-presentation/audio/sound-service", () => ({
  playActionAttentionSound: vi.fn(),
}));

const view = EngineInteractionView.parse({
  protocolVersion: INTERACTION_PROTOCOL_VERSION,
  gameSlug: "flesh-and-blood",
  actorId: "p1",
  stateVersion: 1,
  status: "ready",
  actions: [
    {
      id: "pass",
      requestId: "r1",
      intent: "pass",
      text: { key: "Pass priority" },
      enabled: true,
      inputs: [],
    },
  ],
});

describe("LiveActionAttention", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
    window.localStorage.clear();
    gateway.emit.mockClear();
    gateway.on.mockClear();
    gateway.release.mockClear();
    gateway.on.mockReturnValue(vi.fn());
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("sends thinking through normal chat without a separate opponent notice", () => {
    render(
      <MantineProvider>
        <LiveActionAttention view={view} viewerId="p1" stateVersion={1} canAct gameId="game-1" />
      </MantineProvider>,
    );
    expect(screen.queryByTestId("action-attention-reminder")).toBeNull();
    act(() => vi.advanceTimersByTime(60_000));
    fireEvent.click(screen.getByRole("button", { name: "I’m thinking" }));
    expect(gateway.emit).toHaveBeenCalledWith("send_chat_message", {
      gameId: "game-1",
      presetKey: "thinking",
    });

    expect(gateway.on).not.toHaveBeenCalledWith("chat_message", expect.any(Function));
    expect(screen.queryByText("Your opponent is thinking.")).toBeNull();
  });
});
