import { ClientEvent } from "utils/events";
import { Context } from "utils/events/EventsCollector";

const EVENTS_API_URL = process.env.NEXT_PUBLIC_EVENTS_API_URL!;
const RETRIES_DELAY_MS = 3000;

type RequestPayload = {
  context: Omit<Context, "user_token">;
  event: ClientEvent;
  timestamp: Date;
}[];

type UserConfig = {
  should_sample_fps: boolean;
};

const doPost = async (
  accessToken: string,
  data: RequestPayload
): Promise<void> => {
  const response = await fetch(`${EVENTS_API_URL}/events`, {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-access-token": accessToken,
    },
  });

  if (!response.ok) {
    throw response;
  }
};

export const postEvents = async (
  accessToken: string,
  data: RequestPayload,
  retries = 0
): Promise<void> => {
  try {
    await doPost(accessToken, data);
  } catch (e) {
    if (!retries) {
      throw e;
    }

    setTimeout(() => {
      postEvents(accessToken, data, retries - 1);
    }, RETRIES_DELAY_MS);
  }
};

export const getUserConfig = async (
  accessToken: string,
  userId: number
): Promise<UserConfig | undefined> => {
  const response = await fetch(`${EVENTS_API_URL}/users/${userId}/config`, {
    headers: {
      "x-access-token": accessToken,
    },
  });

  if (response.status === 404) return undefined;

  return await response.json();
};
