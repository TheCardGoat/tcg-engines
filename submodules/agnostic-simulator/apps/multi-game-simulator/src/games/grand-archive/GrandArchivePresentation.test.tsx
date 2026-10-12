// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PresentationSettingsProvider } from "@tcg/simulator-presentation/settings";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import { GrandArchivePresentationFeedback } from "./GrandArchivePresentation";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";

const audio = vi.hoisted(() => ({ init: vi.fn().mockResolvedValue(undefined), play: vi.fn() }));
vi.mock("@tcg/simulator-presentation/audio/sound-service", () => ({
  initSimulatorSoundService: audio.init,
  playSimulatorSound: audio.play,
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Grand Archive confirmed audio", () => {
  it("plays committed movement once and establishes silent load, undo and seat baselines", async () => {
    const base = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (fixture) => fixture.id === "attack-targeting",
    )!;
    const card = base.entities.find((entity) => entity.face === "public")!;
    const moved: GrandArchiveHarnessFixture = {
      ...base,
      table: {
        ...base.table,
        status: { ...base.table.status, stateVersion: (base.table.status.stateVersion ?? 0) + 1 },
        zones: base.table.zones.map((zone) => ({
          ...zone,
          entityIds:
            zone.id === "p1:graveyard"
              ? [...zone.entityIds, card.id]
              : zone.entityIds.filter((id) => id !== card.id),
        })),
      },
    };
    const view = (fixture: GrandArchiveHarnessFixture) => (
      <PresentationSettingsProvider>
        <GrandArchivePresentationFeedback fixture={fixture} />
      </PresentationSettingsProvider>
    );
    const screen = render(view(base));
    await act(async () => {
      fireEvent.pointerDown(document);
    });
    expect(audio.play).not.toHaveBeenCalled();
    screen.rerender(view(moved));
    expect(audio.play).toHaveBeenCalledWith("card.discard", expect.any(Function));
    const queuedSound = audio.play.mock.calls[0]?.[1] as () => boolean;
    expect(queuedSound()).toBe(true);
    const count = audio.play.mock.calls.length;
    screen.rerender(view(moved));
    expect(audio.play).toHaveBeenCalledTimes(count);
    screen.rerender(view(base));
    expect(audio.play).toHaveBeenCalledTimes(count);
    expect(queuedSound()).toBe(false);
    screen.rerender(
      view({
        ...moved,
        table: {
          ...moved.table,
          seats: moved.table.seats.map((seat) => ({
            ...seat,
            perspective: seat.perspective === "bottom" ? "top" : "bottom",
          })),
        },
      }),
    );
    expect(audio.play).toHaveBeenCalledTimes(count);
  });
});
