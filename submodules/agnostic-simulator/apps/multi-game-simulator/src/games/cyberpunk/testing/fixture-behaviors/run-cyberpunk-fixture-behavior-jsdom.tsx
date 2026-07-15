import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../render-cyberpunk-simulator";
import {
  runCyberpunkFixtureBehavior,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

class JsdomAnimationStub extends EventTarget implements Animation {
  currentTime: CSSNumberish | null = null;
  effect: AnimationEffect | null = null;
  readonly finished: Promise<Animation> = Promise.resolve(this);
  id = "";
  oncancel: Animation["oncancel"] = null;
  onfinish: Animation["onfinish"] = null;
  onremove: Animation["onremove"] = null;
  readonly overallProgress = 1;
  readonly pending = false;
  readonly playState: AnimationPlayState = "finished";
  playbackRate = 1;
  readonly ready: Promise<Animation> = Promise.resolve(this);
  readonly replaceState: AnimationReplaceState = "active";
  startTime: CSSNumberish | null = null;
  timeline: AnimationTimeline | null = null;

  cancel(): void {}
  commitStyles(): void {}
  finish(): void {}
  pause(): void {}
  persist(): void {}
  play(): void {}
  reverse(): void {}

  updatePlaybackRate(playbackRate: number): void {
    this.playbackRate = playbackRate;
  }
}

export function ensureJsdomAnimationSupport(): void {
  if (typeof Element === "undefined" || typeof Element.prototype.animate === "function") {
    return;
  }

  const animate: Element["animate"] = () => new JsdomAnimationStub();
  Element.prototype.animate = animate;
}

export async function runCyberpunkFixtureBehaviorInJsdom(
  behavior: CyberpunkFixtureBehavior,
): Promise<void> {
  ensureJsdomAnimationSupport();
  const view = renderCyberpunkSimulatorScenario({ scenarioId: behavior.scenarioId });
  try {
    const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
    await runCyberpunkFixtureBehavior(behavior, pom);
  } finally {
    view.unmount();
  }
}
