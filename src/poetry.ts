import { promises as fs } from "fs";
import os from "os";
import path from "path";
import * as core from "@actions/core";
import { exec } from "@actions/exec";
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

  await exec(`poetry config virtualenvs.create ${toBoolStr(createVirtualenv)}`);
  await exec(
    `poetry config virtualenvs.in-project ${toBoolStr(
      createVirtualenvInProject
    )}`
  );
};
