import { defineEventHandler } from "h3";
import fs from "fs";
import path from "path";

export default defineEventHandler(() => {
  try {
    const filePath = path.join(process.cwd(), "databaseSample.json");
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error reading databaseSample.json:", error.message);
      return { error: "Unable to read data" };
    } else {
      console.error("An unknown error occurred");
      return { error: "Unknown error" };
    }
  }
});
