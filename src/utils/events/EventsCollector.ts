import { Role } from "@joinprisma/common/src/constants/role";
import { ClientEvent } from "utils/events";

export type Context = {
  user_token: string;
  user_email: string;
  user_role: Role;
  application: string;
  section: string;
  group_id?: string;
} & Record<string, string | number | boolean>;

export enum EventType {
  INIT,
  COLLECT_EVENT,
  FLUSH,
}

export type EventsCollectorInitEvent = {
  type: EventType.INIT;
  payload: Context;
};

export type EventsCollectorAddEvent = {
  type: EventType.COLLECT_EVENT;
  payload: ClientEvent;
};

export type EventsCollectorFlushEvent = {
  type: EventType.FLUSH;
  terminate: boolean;
};

export type EventsCollectorEvent =
  | EventsCollectorInitEvent
  | EventsCollectorAddEvent
  | EventsCollectorFlushEvent;

export default class EventsCollector {
  private static context?: Context;
  private static worker?: Worker;

  public static start(context: Context): void {
    if (EventsCollector.context || EventsCollector.worker)
      throw new Error("EventsCollector already started");

    EventsCollector.context = context;
    EventsCollector.worker = new Worker(
      new URL("./EventsCollectorWorker.ts", import.meta.url)
    );

    EventsCollector.worker.postMessage({
      type: EventType.INIT,
      payload: context,
    });
  }

  public static stop(): void {
    EventsCollector.flush({ terminate: true });

    delete EventsCollector.worker;
    delete EventsCollector.context;
  }

  public static collect(event: ClientEvent): void {
    if (!EventsCollector.worker)
      throw new Error("EventsCollector not initialized");

    EventsCollector.worker.postMessage({
      type: EventType.COLLECT_EVENT,
      payload: event,
    });
  }

  private static flush({ terminate } = { terminate: false }): void {
    if (!EventsCollector.worker)
      throw new Error("EventsCollector not initialized");

    EventsCollector.worker.postMessage({
      type: EventType.FLUSH,
      terminate,
    });
  }
}
