import { addSeconds } from "date-fns";
import { ClientEvent } from "utils/events";
import { postEvents } from "./events-api";
import { Context, EventsCollectorEvent, EventType } from "./EventsCollector";

const LOGGER_PERIOD_MS = 20000;
const MAX_RETRIES = 3;

export type TimedEvent = ClientEvent & { time_offset: number };

let events: TimedEvent[] = [];
let accessToken: string;
let context: Omit<Context, "user_token">;
let sessionStartTime: Date;

const getServerTime = async (): Promise<Date> => {
  if (sessionStartTime) return sessionStartTime;

  const response = await fetch("/api/clock/now");

  sessionStartTime = new Date(await response.json());

  return sessionStartTime;
};

const buildTimeStamp = (
  sessionStartTime: Date,
  eventOffsetInMillis: number
): Date => {
  const secondsOffset = Math.round(eventOffsetInMillis / 1000);
  return addSeconds(sessionStartTime, secondsOffset);
};

const getAndFlushEvents = async () => {
  const serverTime = await getServerTime();
  // The events in the queue are prepared to be sent to the server
  const data = events.map(({ time_offset, ...event }) => ({
    context,
    event,
    timestamp: buildTimeStamp(serverTime, time_offset),
  }));

  // The queue is flushed so we can start collecting new events.
  events = [];

  return data;
};

/**
 * Every event needs a timestamp, but we can't rely on the client's clock for that
 * since it might be out of sync.
 *
 * Also, we can't let the server add the timestamp when it receives the event,
 * since events are queued in the client and sent in batches.
 *
 * For that reason, we store the session start time and add the
 * time offset to the timestamp of each event.
 */
setInterval(async () => {
  if (events.length === 0) return;

  // The data is sent to the server
  await postEvents(accessToken, await getAndFlushEvents(), MAX_RETRIES);
}, LOGGER_PERIOD_MS);

addEventListener("message", async (message) => {
  const { type } = message.data as EventsCollectorEvent;

  switch (type) {
    case EventType.INIT: {
      const { user_token, ...restOfContext } = message.data.payload;
      accessToken = user_token;
      context = restOfContext;
      break;
    }

    case EventType.COLLECT_EVENT:
      events.push({ ...message.data.payload, time_offset: performance.now() });
      break;

    case EventType.FLUSH:
      // FIXME: This does not work reliably when closing the window
      // for that reason we should use the Beacon API but unfortunately
      // it is not ready to be used in the context of a webworker.
      // You can check the spec to see when it lands here
      // http://man.hubwiz.com/docset/JavaScript.docset/Contents/Resources/Documents/developer.mozilla.org/en-US/docs/Web/API/WorkerNavigator/sendBeacon.html

      try {
        await postEvents(accessToken, await getAndFlushEvents(), MAX_RETRIES);
      } finally {
        if (message.data.terminate) {
          self.close();
        }
      }

      break;

    default:
      break;
  }
});

export default {};
