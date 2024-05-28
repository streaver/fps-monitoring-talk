// Constants for time and FPS limits
const ONE_SECOND = 1000;
const MAX_FPS = 60;
const FPS_EVENT_NAME = "fps";
const VISIBILITY_CHANGE_EVENT_NAME = "visibility_change";

export default class FPSSampler {
  private requestAnimationFrameId?: number;
  private fps: number = 0;
  private previousTime: number = performance.now();
  private user: string;
  private visibilityChangeHandler: () => void;

  constructor(user: string) {
    this.user = user;
    this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
  }

  // Starts the FPS sampling process
  public start(): void {
    this.reset();
    document.addEventListener("visibilitychange", this.visibilityChangeHandler);
    this.sendEvent(VISIBILITY_CHANGE_EVENT_NAME, { isVisible: true });
    this.requestNewFrame();
  }

  // Stops the FPS sampling and removes event listeners
  public stop(): void {
    if (this.requestAnimationFrameId) {
      window.cancelAnimationFrame(this.requestAnimationFrameId);
      this.flush();
    }

    document.removeEventListener(
      "visibilitychange",
      this.visibilityChangeHandler
    );
  }

  private requestNewFrame(): void {
    this.requestAnimationFrameId = window.requestAnimationFrame(
      this.loop.bind(this)
    );
  }

  // Main loop for FPS calculation
  private loop(currentTime: number): void {
    if (currentTime - this.previousTime >= ONE_SECOND) {
      this.sendFPS(this.fps);
      this.reset();
    } else {
      this.fps += 1;
    }

    this.requestNewFrame();
  }

  // Resets FPS counters and time
  private reset(): void {
    this.previousTime = performance.now();
    this.fps = 0;
  }

  // Reports the final FPS count before stopping or visibility change
  private flush(): void {
    if (this.fps === 0) return; // Avoids reporting 0 FPS, which is inaccurate during fast tab switches

    const currentTime = performance.now();
    const timeElapsed = currentTime - this.previousTime;
    const normalizedFPS = Math.round((this.fps * ONE_SECOND) / timeElapsed);

    this.sendFPS(normalizedFPS);
  }

  // Handles visibility change events to pause/resume FPS measurement
  private handleVisibilityChange(): void {
    const isVisible = document.visibilityState === "visible";
    if (isVisible) {
      this.reset();
    } else {
      this.flush();
    }

    this.sendEvent(VISIBILITY_CHANGE_EVENT_NAME, { isVisible });
  }

  private async sendFPS(fps: number): Promise<void> {
    const fpsValue = Math.min(fps, MAX_FPS);

    this.sendEvent(FPS_EVENT_NAME, { fps: fpsValue });
  }

  public async sendEvent(eventName: string, data: any): Promise<void> {
    try {
      await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user": this.user,
        },
        body: JSON.stringify({ eventName, data }),
      });
    } catch (error) {
      console.error("Failed to send event data:", error);
    }
  }
}
