// Minimal mock of the MediaMTX v3 Control API for e2e tests, so the UI's
// dashboard (which loads global/pathdefaults/paths on startup) can render
// without a real MediaMTX server.
import http from "http";

const PORT = Number(process.env.MOCK_PORT) || 19997;

const GLOBAL = {
    logLevel: "info",
    logDestinations: ["stdout"],
    api: true,
    apiAddress: ":9997",
    metrics: true,
    metricsAddress: ":9998",
    rtsp: true,
    protocols: ["tcp", "udp"],
    encryption: "no",
    rtspAddress: ":8554",
    rtmp: true,
    rtmpAddress: ":1935",
    hls: true,
    hlsAddress: ":8888",
    hlsVariant: "lowLatency",
    webrtc: true,
    webrtcAddress: ":8889",
    srt: true,
    srtAddress: ":8890",
    authMethod: "internal",
};

const PATH_DEFAULTS = {
    source: "publisher",
    record: false,
    recordPath: "./recordings/%path/%Y-%m-%d_%H-%M-%S-%f",
    rtspTransport: "automatic",
};

const send = (res, code, obj) => {
    res.writeHead(code, {"Content-Type": "application/json"});
    res.end(JSON.stringify(obj));
};

http.createServer((req, res) => {
    const u = (req.url || "").split("?")[0];
    if (u === "/v3/config/global/get") return send(res, 200, GLOBAL);
    if (u === "/v3/config/pathdefaults/get") return send(res, 200, PATH_DEFAULTS);
    if (u === "/v3/config/paths/list") return send(res, 200, {itemCount: 0, pageCount: 0, items: []});
    if (u.endsWith("/list")) return send(res, 200, {itemCount: 0, pageCount: 0, items: []});
    if (req.method === "PATCH" || req.method === "POST" || req.method === "DELETE") {
        let b = ""; req.on("data", d => (b += d)); req.on("end", () => send(res, 200, {}));
        return;
    }
    send(res, 200, {});
}).listen(PORT, () => console.log(`mock mediamtx on ${PORT}`));
