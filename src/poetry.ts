import { promises as fs } from "fs";
import os from "os";
import path from "path";
import * as core from "@actions/core";
import { saveCache, restoreCache } from "@actions/cache";
import { exec } from "@actions/exec";
import { downloadTool } from "@actions/tool-cache";
import { toBoolStr } from "./convert";

export interface InstallPoetryConfig {
  poetryVersion: string;
  createVirtualenv?: boolean;
  createVirtualenvInProject?: boolean;
}

export const installPoetry = async ({
  poetryVersion: version,
  createVirtualenv = true,
  createVirtualenvInProject = false,
}: InstallPoetryConfig): Promise<void> => {
  const destPath = path.join(os.homedir(), ".poetry");
  const cacheKey = `tool-python-poetry-${version}`;
  const cached = await restoreCache([destPath], cacheKey);

  if (cached !== undefined) {
    core.info(`Found cached Poetry for version ${version}`);
  } else {
    core.info(
      `Did not find existing cached Poetry for version ${version}. Installing...`
    );
    await downloadTool(
      "https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py",
      "get-poetry.py"
    );

    const flags = ["--yes"];
    if (version !== "latest") {
      flags.push("--version", version);
    }
    await exec(`python get-poetry.py ${flags.join(" ")}`);
    await fs.unlink("get-poetry.py");

    core.info("Installation complete. Caching...");

    await saveCache([destPath], cacheKey);
  }

  core.addPath(path.join(destPath, "bin"));

  core.info("Configuring Poetry...");
  await exec(`poetry config virtualenvs.create ${toBoolStr(createVirtualenv)}`);
  await exec(
    `poetry config virtualenvs.in-project ${toBoolStr(
      createVirtualenvInProject
    )}`
  );

  core.info("Listing final Poetry configuration.");
  await exec("poetry config --list");
};
