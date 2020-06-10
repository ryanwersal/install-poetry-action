import { promises as fs } from "fs";
import os from "os";
import path from "path";
import * as core from "@actions/core";
import { exec } from "@actions/exec";

export const installPoetry = async (version: string): Promise<void> => {
  await exec(
    "curl -O -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py"
  );

  const flags = ["--yes"];
  if (version !== "latest") {
    flags.push("--version", version);
  }
  await exec(`python get-poetry.py ${flags.join(" ")}`);

  core.addPath(path.join(os.homedir(), ".poetry", "bin"));
  await fs.unlink("get-poetry.py");
};
