type FpsEvents = "FPS";

type PageVisibilityEvents = "VISIBILITY_CHANGE";

type DocumentBackendEvents =
  | "DOCUMENT_BACKEND_SOCKET_CONNECTED"
  | "DOCUMENT_BACKEND_SOCKET_DISCONNECTED";

type SessionEvents =
  | "SESSION_CONNECTED"
  | "SESSION_DISCONNECTED"
  | "SESSION_RECONNECTING"
  | "SESSION_CONNECTION_ERROR"
  | "USER_ALREADY_IN_SESSION";

type StreamsEvents =
  | "PUBLISHING_STOPPED"
  | "PUBLISHER_CREATED"
  | "PUBLISHER_CREATION_ERROR"
  | "PUBLISHING"
  | "PUBLISHING_ERROR"
  | "PUBLISHER_PRODUCES_NO_IMAGE"
  | "AUDIO_BLOCKED"
  | "AUDIO_UNBLOCKED"
  | "SUBSCRIBER_CREATED"
  | "SUBSCRIBER_CREATION_ERROR"
  | "VIDEO_SUBSCRIPTIONS_LIMIT_CHANGED";

type DevicesEvents = "HAS_PERMISSIONS_FOR_DEVICE";

type VideoPlayerEvents = "VIDEO_PLAYING" | "VIDEO_STOPPED";

type CanvasEvents = "LIVE_CANVAS_CHANGED";

type CursorEvents =
  | "SHARING_CURSOR"
  | "STOPPED_SHARING_CURSOR"
  | "RECEIVING_CURSOR"
  | "STOPPED_RECEIVING_CURSOR";

type AnimationStatusEvents = "HAS_ANIMATIONS_ENABLED";

type EventName =
  | FpsEvents
  | PageVisibilityEvents
  | DocumentBackendEvents
  | SessionEvents
  | StreamsEvents
  | DevicesEvents
  | VideoPlayerEvents
  | CanvasEvents
  | CursorEvents
  | AnimationStatusEvents;

export type ClientEvent = {
  name: EventName;
  value?: number;
} & Record<string, string | number | boolean>;
