import { afterEach, expect, test, vi } from "vite-plus/test";
import { createCyberpunkEffectAudio } from "./cyberpunk-effect-audio";

const audio = vi.hoisted(() => ({ play: vi.fn() }));
vi.mock("@tcg/simulator-presentation/audio/sound-service", () => ({
  playSimulatorSound: audio.play,
}));
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  audio.play.mockReset();
});
test("returns a null controller in unsupported test environments", () => {
  expect(createCyberpunkEffectAudio(() => 1)).toBeNull();
});
test("uses pack cues and suppresses queued playback after mute or cancellation", () => {
  vi.stubGlobal("navigator", { userAgent: "browser" });
  vi.useFakeTimers();
  let gain = 1;
  const controller = createCyberpunkEffectAudio(() => gain)!;
  controller.play("wipeImpact", 100);
  vi.advanceTimersByTime(100);
  const [cue, shouldPlay] = audio.play.mock.calls[0]!;
  expect(cue).toBe("combat.hit");
  expect(shouldPlay()).toBe(true);
  gain = 0;
  expect(shouldPlay()).toBe(false);
  gain = 1;
  controller.cancelScheduled();
  expect(shouldPlay()).toBe(false);
  controller.play("goSolo", 100);
  controller.dispose();
  vi.advanceTimersByTime(100);
  expect(audio.play).toHaveBeenCalledOnce();
});
