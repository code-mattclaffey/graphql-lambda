/* eslint-disable no-undef */
import { build } from "esbuild";
import { rm } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execPromise = promisify(exec);

async function bundle() {
  try {
    await rm("dist", { recursive: true, force: true });

    await build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      minify: true,
      sourcemap: true,
      treeShaking: true,
      platform: "node",
      target: "node18",
      outfile: "dist/index.js",
      loader: { ".graphql": "text" }, // Ensure GraphQL schema is included
      resolveExtensions: [".ts", ".js"],
      alias: {
        "@src": path.resolve("src"),
        "@utils": path.resolve("src/utils"),
        "@common": path.resolve("src/modules/common"),
        "@dev": path.resolve("dev"),
      },
    });

    await execPromise("cd dist && zip -r lambda.zip *");

    console.log("✅ Build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

bundle();
