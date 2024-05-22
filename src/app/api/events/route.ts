import { InfluxDB, Point } from "@influxdata/influxdb-client";

export async function POST(request: Request) {
  const token = process.env.INFLUXDB_TOKEN;
  const user = request.headers.get("x-user") ?? "unknown";
  const url = "http://influxdb:8086";

  const client = new InfluxDB({ url, token });

  const org = `streaver`;
  const bucket = `fps`;
  const writeClient = client.getWriteApi(org, bucket, "ns");

  const { eventName, data } = await request.json();

  const point = new Point(eventName).tag("user", user);

  if (eventName === "fps") {
    point.intField("fps", data.fps);
  } else if (eventName === "visibility_change") {
    point.booleanField("isVisible", data.isVisible);
  } else {
    point.intField("value", data);
  }

  writeClient.writePoint(point);
  writeClient.flush();

  return Response.json({ ok: "ok" });
}
