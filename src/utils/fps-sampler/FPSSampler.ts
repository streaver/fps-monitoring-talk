// Constants for time and FPS limits
const ONE_SECOND = 1000;
const MAX_FPS = 60;
const FPS_EVENT_NAME = "FPS";
const VISIBILITY_CHANGE_EVENT_NAME = "VISIBILITY_CHANGE";

export default class FPSSampler {
  requestAnimationFrameId?: number;
  fps: number = 0;
  previousTime: number = performance.now();

  // Starts the FPS sampling process
  start(): void {
    this.restart();

    document.addEventListener("visibilitychange", this.visibilityChangeHandler);

    this.requestNewFrame();
  }

  // Stops the FPS sampling and removes event listeners
  stop(): void {
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
    if (Math.floor(currentTime - this.previousTime) > ONE_SECOND) {
      this.reportFPS();
      this.restart();
    } else {
      this.fps += 1;
    }

    this.requestNewFrame();
  }

  // Reports the calculated FPS to the EventsCollector
  private reportFPS(): void {
    const fpsValue = Math.min(this.fps, MAX_FPS); // Negative value for percentile computation
    // EventsCollector.collect({ name: FPS_EVENT_NAME, value: fpsValue });

    fetch("http://localhost:5001/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fps: fpsValue }),
    });
  }

  // Resets FPS counters and time
  private restart() {
    this.previousTime = performance.now();
    this.fps = 0;
  }

  // Reports the final FPS count before stopping or visibility change
  private flush() {
    if (this.fps === 0) return; // Avoids reporting 0 FPS, which is inaccurate during fast tab switches

    const currentTime = performance.now();
    const timeElapsed = currentTime - this.previousTime;
    // Normalizes FPS for the actual time elapsed, adjusting for partial seconds
    const normalizedFPS = Math.round((this.fps * ONE_SECOND) / timeElapsed);
    // EventsCollector.collect({ name: FPS_EVENT_NAME, value: Math.min(normalizedFPS, MAX_FPS) * -1 });

    fetch("http://localhost:5001/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fps: normalizedFPS }),
    });
  }

  // Handles visibility change events to pause/resume FPS measurement
  private visibilityChangeHandler() {
    const isVisible = document.visibilityState === "visible";
    // Restarts or flushes the FPS calculation based on the visibility
    isVisible ? this.restart() : this.flush();
    // Collects visibility change events for additional insights
    // EventsCollector.collect({ name: VISIBILITY_CHANGE_EVENT_NAME, isVisible });
  }
}
