import { InfluxDB, Point } from "@influxdata/influxdb-client";

export async function POST(request: Request) {
  const token = process.env.INFLUXDB_TOKEN;
  const user = request.headers.get("x-user") ?? "unknown";
  const url = "http://influxdb:8086";

  const client = new InfluxDB({ url, token });

  const org = `streaver`;
  const bucket = `fps`;
  const writeClient = client.getWriteApi(org, bucket, "ns");

  const point = new Point("frames_per_second")
    .tag("user", user)
    .intField("fps", JSON.parse(await request.text()).fps);

  writeClient.writePoint(point);
  writeClient.flush();

  return Response.json({ ok: "ok" });
}
