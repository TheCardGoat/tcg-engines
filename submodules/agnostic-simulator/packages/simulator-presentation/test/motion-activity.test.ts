import { expect, test } from "vite-plus/test";
import { createMotionActivity } from "../src/motion-activity";

test("a completed or cancelled motion cannot release another motion's hold", () => {
  const activity = createMotionActivity();
  const first = activity.begin();
  const second = activity.begin();
  first();
  first();
  expect(activity.getSnapshot()).toBe(true);
  second();
  expect(activity.getSnapshot()).toBe(false);
});
