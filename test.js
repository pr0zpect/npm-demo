import { envGuard, EnvGuardError } from "@pr0zpect/env-guard";
import { schema } from "./config.js";

console.log("--- Test 1: Valid environment configuration ---");
const validEnv = envGuard(schema, {
  source: {
    PORT: "4000",
    NODE_ENV: "production",
    APP_NAME: "TestApp",
    API_KEY: "secret-key",
  },
});
console.log("Validated PORT:", validEnv.PORT, typeof validEnv.PORT);
console.log("Validated NODE_ENV:", validEnv.NODE_ENV);
console.assert(validEnv.PORT === 4000, "Port should be 4000");
console.assert(typeof validEnv.PORT === "number", "Port should be number");
console.log("Test 1 passed!\n");

console.log("--- Test 2: Invalid port and missing required API_KEY ---");
try {
  envGuard(schema, {
    source: {
      PORT: "99999", // Invalid port (>65535)
    },
  });
  console.error("Test 2 failed: Should have thrown EnvGuardError");
  process.exit(1);
} catch (err) {
  if (err instanceof EnvGuardError) {
    console.log("Caught expected EnvGuardError with issues:");
    for (const issue of err.issues) {
      console.log(` - ${issue.variable}: ${issue.status} (${issue.message})`);
    }
    console.log("Test 2 passed!\n");
  } else {
    throw err;
  }
}

console.log("All @pr0zpect/env-guard verification tests passed successfully!");
