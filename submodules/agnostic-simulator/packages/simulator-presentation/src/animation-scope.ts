/** Owns one effect's animations, including finished fill poses, until cleanup. */
export class AnimationScope {
  private animations = new Set<Animation>();
  private cancelled = false;
  private paused = new Set<Animation>();
  private visibility = () => {
    if (document.hidden) {
      for (const animation of this.animations) {
        if (animation.playState === "running") {
          animation.pause();
          this.paused.add(animation);
        }
      }
    } else {
      for (const animation of this.paused) animation.play();
      this.paused.clear();
    }
  };
  constructor() {
    document.addEventListener("visibilitychange", this.visibility);
  }
  get active() {
    return !this.cancelled;
  }

  animate(element: Element, frames: Keyframe[], options: KeyframeAnimationOptions): Animation {
    if (this.cancelled) throw new DOMException("Animation scope closed", "AbortError");
    const animation = element.animate(frames, options);
    this.animations.add(animation);
    void animation.finished.catch(() => {});
    this.visibility();
    return animation;
  }

  async run(work: () => Promise<void>): Promise<boolean> {
    try {
      await work();
      return this.active;
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        error.name === "AbortError"
      )
        return false;
      throw error;
    }
  }

  cancel() {
    this.cancelled = true;
    document.removeEventListener("visibilitychange", this.visibility);
    this.paused.clear();
    for (const animation of this.animations) animation.cancel();
    this.animations.clear();
  }
}
