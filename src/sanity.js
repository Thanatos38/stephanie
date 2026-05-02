// import { createClient } from "@sanity/client";

// export const client = createClient({
//   projectId: "8sb51mxk", // 🔥 replace this
//   dataset: "production",
//   useCdn: true,
//   apiVersion: "2023-01-01",
//   token: "skmFryNLQZs1n8gDQX7vXSwtTSDmR1IvHuaJFvAfEYRVii68wT3ZZzVQspvksoFELkVXFLOUVADJnQCmD7pnaaZY178YA3H5IQBwiPugW5msxBQNOnxYte1pE34pEXZxTGwAcWlmXTGtLapccRmjn5A8hq8B2Jd3ltuZCqMmiE78iNnNenPq"
// });

// src/sanity.js
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "8sb51mxk",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2023-01-01",
  token: import.meta.env.VITE_SANITY_TOKEN,
});
