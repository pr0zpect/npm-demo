import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env, schema } from "./config.js";
import { envGuard, EnvGuardError, formatIssues, getSanitizedEnv } from "@pr0zpect/env-guard";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.json());

// Serve static UI assets from public folder
app.use(express.static(path.join(__dirname, "public")));

// API: Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API: Server configuration inspection (safe with secrets masked)
app.get("/config", (req, res) => {
  const safeConfig = getSanitizedEnv(env, schema);
  res.json({
    description: "Sanitized configuration inspected via @pr0zpect/env-guard",
    config: safeConfig,
    rawSchema: schema,
  });
});

// API: Dynamic validation endpoint for interactive playground
app.post("/api/validate", (req, res) => {
  const { schema: inputSchema, source, options } = req.body;
  if (!inputSchema) {
    return res.status(400).json({ success: false, error: "Missing schema definition" });
  }

  try {
    const validated = envGuard(inputSchema, {
      source: source || {},
      ...options,
    });
    const sanitized = getSanitizedEnv(validated, inputSchema);

    return res.json({
      success: true,
      env: validated,
      sanitized,
    });
  } catch (error) {
    if (error instanceof EnvGuardError) {
      return res.json({
        success: false,
        name: error.name,
        message: error.message,
        formatted: formatIssues(error.issues),
        issues: error.issues,
      });
    }
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Protected route: validates secret API key from header
app.get("/protected", (req, res) => {
  const clientKey = req.headers["x-api-key"];
  if (!clientKey || clientKey !== env.API_KEY) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing or invalid 'x-api-key' header",
    });
  }

  res.json({
    message: "Access granted! Secret API key verified successfully.",
    authenticated: true,
    user: "authorized-client",
  });
});

// Start server if executed directly
const isDirectExecution = process.argv[1] === __filename;
if (isDirectExecution) {
  app.listen(env.PORT, () => {
    console.log(`\n🛡️  ======================================================`);
    console.log(`🚀 [${env.APP_NAME}] running at http://localhost:${env.PORT}`);
    console.log(`   - Environment: ${env.NODE_ENV}`);
    console.log(`   - Interactive UI: http://localhost:${env.PORT}/`);
    console.log(`   - Diagnostic /config: http://localhost:${env.PORT}/config`);
    console.log(`======================================================\n`);
  });
}

export default app;
