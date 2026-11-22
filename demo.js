import { envGuard, EnvGuardError, formatIssues, getSanitizedEnv } from "@pr0zpect/env-guard";

const divider = (title) => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(` 🚀 DEMO SCENARIO: ${title}`);
  console.log(`${"=".repeat(60)}`);
};

console.log("\n🛡️  @pr0zpect/env-guard Feature Demonstration Project 🛡️");

// -------------------------------------------------------------
// Scenario 1: Automatic Type Parsing and Validation
// -------------------------------------------------------------
divider("1. Type Coercion & Default Fallbacks");
console.log("Raw environment string values from process.env / source:");
const rawEnv1 = {
  PORT: "8080",
  DEBUG: "true",
  DATABASE_URL: "postgresql://postgres:pass@localhost:5432/mydb",
  CACHE_ENABLED: "no",
  ADMIN_EMAIL: "admin@example.com",
};
console.dir(rawEnv1);

const schema1 = {
  PORT: { type: "port", default: 3000 },
  NODE_ENV: {
    type: "enum",
    values: ["development", "production", "test"],
    default: "development",
  },
  DEBUG: { type: "boolean", default: false },
  DATABASE_URL: { type: "url", required: true },
  CACHE_ENABLED: { type: "boolean", default: true },
  ADMIN_EMAIL: { type: "email", required: true },
};

const validatedEnv1 = envGuard(schema1, { source: rawEnv1 });

console.log("\nParsed & Type-Safe Output Object:");
console.log(`- PORT:          ${validatedEnv1.PORT} (type: ${typeof validatedEnv1.PORT})`);
console.log(`- NODE_ENV:      "${validatedEnv1.NODE_ENV}" (default applied)`);
console.log(`- DEBUG:         ${validatedEnv1.DEBUG} (type: ${typeof validatedEnv1.DEBUG})`);
console.log(`- DATABASE_URL:  ${validatedEnv1.DATABASE_URL}`);
console.log(`- CACHE_ENABLED: ${validatedEnv1.CACHE_ENABLED} (parsed 'no' -> false)`);
console.log(`- ADMIN_EMAIL:   ${validatedEnv1.ADMIN_EMAIL}`);

// -------------------------------------------------------------
// Scenario 2: Secret Protection and Redaction
// -------------------------------------------------------------
divider("2. Automatic Secret Protection & Redaction");
console.log("Defining variables with 'secret: true' prevents sensitive leaks.");

const schema2 = {
  PUBLIC_API_URL: { type: "url", default: "https://api.example.com" },
  API_SECRET_KEY: {
    type: "string",
    required: true,
    secret: true,
  },
  DB_PASSWORD: {
    type: "string",
    required: true,
    secret: true,
  },
};

const rawEnv2 = {
  API_SECRET_KEY: "super-confidential-token-12345",
  DB_PASSWORD: "admin-master-password",
};

const validatedEnv2 = envGuard(schema2, { source: rawEnv2 });

console.log("\nDirect in-memory access (works for authorized code):");
console.log(`- Direct API_SECRET_KEY value: "${validatedEnv2.API_SECRET_KEY}"`);

console.log("\nSafe diagnostic preview via getSanitizedEnv():");
const sanitized = getSanitizedEnv(validatedEnv2, schema2);
console.log(sanitized);

// -------------------------------------------------------------
// Scenario 3: Fail-Fast Validation and Error Reporting
// -------------------------------------------------------------
divider("3. Fail-Fast Error Catching & Formatting");
console.log("Simulating missing required fields, invalid port, and malformed URL...");

const rawEnv3 = {
  PORT: "99999", // Port > 65535
  SITE_URL: "invalid-url-string",
  NODE_ENV: "staging", // Not in allowed enum list
};

try {
  envGuard(
    {
      PORT: { type: "port", required: true },
      SITE_URL: { type: "url", required: true },
      NODE_ENV: {
        type: "enum",
        values: ["development", "production", "test"],
      },
      JWT_SECRET: {
        type: "string",
        required: true,
        secret: true,
      },
    },
    { source: rawEnv3 }
  );
} catch (err) {
  if (err instanceof EnvGuardError) {
    console.log("\nCaught EnvGuardError!");
    console.log(`Number of validation issues: ${err.issues.length}`);
    console.log("\nStructured Issues Details:");
    err.issues.forEach((issue, idx) => {
      console.log(`  ${idx + 1}. [${issue.variable}] ${issue.status}: ${issue.message}`);
    });

    console.log("\nFormatted Terminal Display (formatIssues):");
    console.log(formatIssues(err.issues));
  } else {
    throw err;
  }
}

// -------------------------------------------------------------
// Scenario 4: Conditional Validation (requiredWhen)
// -------------------------------------------------------------
divider("4. Conditional Validation with requiredWhen");
console.log("When STORAGE_PROVIDER is 's3', S3_BUCKET becomes required.");

const schema4 = {
  STORAGE_PROVIDER: {
    type: "enum",
    values: ["local", "s3"],
    default: "local",
  },
  S3_BUCKET: {
    type: "string",
    requiredWhen: {
      variable: "STORAGE_PROVIDER",
      equals: "s3",
    },
  },
};

console.log("\nCase A: STORAGE_PROVIDER = 'local' (S3_BUCKET not required):");
const envLocal = envGuard(schema4, { source: { STORAGE_PROVIDER: "local" } });
console.log(`- Result: STORAGE_PROVIDER = ${envLocal.STORAGE_PROVIDER}, S3_BUCKET = ${envLocal.S3_BUCKET}`);

console.log("\nCase B: STORAGE_PROVIDER = 's3' without S3_BUCKET (should fail):");
try {
  envGuard(schema4, { source: { STORAGE_PROVIDER: "s3" } });
} catch (err) {
  console.log(`- Caught validation failure: ${err.issues[0].message}`);
}

console.log(`\n${"=".repeat(60)}`);
console.log(" 🎉 All @pr0zpect/env-guard scenarios executed successfully!");
console.log(`${"=".repeat(60)}\n`);
