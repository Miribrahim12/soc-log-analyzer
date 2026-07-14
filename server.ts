import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API route: analyze log (handles mock requests or acts as a local fallback)
app.post("/api/analyze-log", (req, res) => {
  try {
    const { alert_type, raw_log, severity } = req.body;

    if (!alert_type || !raw_log) {
      res.status(400).json({
        success: false,
        error: "Threat Type (alert_type) and Technical Log (raw_log) are required."
      });
      return;
    }

    // Dynamic extraction helper for local analysis
    const srcIpMatch = raw_log.match(/(?:Source IP|SRC|Source|src):\s*([0-9a-fA-F.:]+)/i) || raw_log.match(/from\s+([0-9a-fA-F.:]+)/i);
    const dstIpMatch = raw_log.match(/(?:Target IP|DST|Target|dst):\s*([0-9a-fA-F.:]+)/i) || raw_log.match(/to\s+([0-9a-fA-F.:]+)/i);
    const portMatch = raw_log.match(/(?:Target Port|Port|port):\s*(\d+)/i) || raw_log.match(/:(\d+)/i);
    const protoMatch = raw_log.match(/(?:Protocol|Proto):\s*(\w+)/i) || (raw_log.toLowerCase().includes("tcp") ? ["", "TCP"] : raw_log.toLowerCase().includes("udp") ? ["", "UDP"] : ["", "TCP"]);

    const sourceIp = srcIpMatch ? srcIpMatch[1] : "INFECTED_DEVICE";
    const targetIp = dstIpMatch ? dstIpMatch[1] : "INTERNAL_SERVER";
    const port = portMatch ? portMatch[1] : "80";
    const protocol = protoMatch ? protoMatch[1].toUpperCase() : "TCP";
    const activeSeverity = severity || "High";

    const localReport = `🚨 1. INCIDENT DESCRIPTION (What happened?):
- An active network threat of type "${alert_type}" was processed locally by the offline SOC analyzer.
- Severity Level: **${activeSeverity.toUpperCase()}**. Left unmitigated, this threat represents a high probability of access violations, system compromise, or network data exposure.

🔍 2. TECHNICAL ANALYSIS (Details):
- **Attacker Source**: ${sourceIp}
- **Target Server**: ${targetIp}
- **Protocol & Port**: ${protocol} / Port ${port}
- **Technical Analysis of Payload**:
  - The offline SOC analyzer parsed the raw log matrix successfully.
  - Extracted Payload Metadata:
    \`\`\`
    ${raw_log.trim()}
    \`\`\`

🛡️ 3. URGENT ACTIONS (What should the administrator do?):
1. **Apply IP Firewall Block**: Immediately deploy a firewall rule to discard all traffic involving the source IP \`${sourceIp}\` at the edge or perimeter firewall level.
2. **Close Port and Review ACLs**: Restrict public access to port \`${port}\` on host \`${targetIp}\` unless explicitly required for production services.
3. **Conduct Host Audit**: Audit connection and authorization logs on \`${targetIp}\` to ensure no unauthorized administrative shells were established.`;

    res.json({
      success: true,
      report: localReport
    });
  } catch (error: any) {
    console.error("Local mock server error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during local analysis."
    });
  }
});

// Configure Vite middleware for development vs static asset serving for production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SOC Log Analyzer local mock server is running on http://localhost:${PORT}`);
  });
}

setupServer();
