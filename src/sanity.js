import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "8sb51mxk", // 🔥 replace this
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-01-01",
});