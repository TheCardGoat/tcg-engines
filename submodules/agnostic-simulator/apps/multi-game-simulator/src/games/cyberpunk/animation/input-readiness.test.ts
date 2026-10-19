import { expect, test } from "vite-plus/test";
import { createSimulatorAnimationStore } from "@tcg/simulator-runtime/animation";
import { isCyberpunkPresentationPending } from "./input-readiness";

test("input follows presented versions, not animation completion, including queued updates and rollback", () => {
  const store = createSimulatorAnimationStore<number>();
  store.hydrate({ state: 0, version: 0 });
  const pending = () => {
    const snapshot = store.getSnapshot();
    return isCyberpunkPresentationPending(
      snapshot.presentationVersion,
      snapshot.authoritativeVersion!,
    );
  };
  const enqueue = (version: number) =>
    store.enqueue({
      state: version,
      version,
      plan: {
        id: `move-${version}`,
        version: 2,
        steps: [{ id: "hold", type: "hold", durationMs: 2000 }],
      },
    });
  enqueue(1);
  expect(pending()).toBe(true);
  const first = store.getSnapshot().activeTransition!.id;
  store.startActive(first);
  expect(pending()).toBe(false);
  expect(store.getSnapshot().activeTransition?.phase).toBe("running");
  // A second response must not pair a newer action set with an older board.
  enqueue(2);
  expect(pending()).toBe(true);
  store.beginReflow(first);
  store.finishActive(first);
  expect(pending()).toBe(true);
  const second = store.getSnapshot().activeTransition!.id;
  store.startActive(second);
  expect(pending()).toBe(false);
  store.beginReflow(second);
  expect(pending()).toBe(false);
  store.replaceFromSync({ state: 0, version: 0 });
  expect(pending()).toBe(false);
  expect(store.getSnapshot().activeTransition).toBeNull();
  expect(isCyberpunkPresentationPending(2, 0)).toBe(true);
});
