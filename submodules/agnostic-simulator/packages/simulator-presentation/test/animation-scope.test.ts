// @vitest-environment jsdom
import { expect, test, vi } from "vite-plus/test";
import { AnimationScope } from "../src/animation-scope";

test("cancelling an in-flight effect settles its sequence without an unhandled rejection", async () => {
  let reject: (error: Error) => void = () => {};
  const finished = new Promise<Animation>((_resolve, fail) => {
    reject = fail;
  });
  const element = document.createElement("div");
  const cancel = vi.fn(() => reject(new DOMException("Cancelled", "AbortError")));
  // jsdom has no Web Animations API; substitute only this browser boundary.
  Object.defineProperty(element, "animate", { value: () => ({ finished, cancel }) });
  const scope = new AnimationScope();
  const completion = scope.run(async () => {
    await scope.animate(element, [], { duration: 100 }).finished;
  });
  scope.cancel();
  expect(await completion).toBe(false);
  expect(cancel).toHaveBeenCalledOnce();
  expect(scope.active).toBe(false);
});
