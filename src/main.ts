import * as core from "@actions/core";
import { installPoetry } from "./poetry";

const run = async () => {
  try {
    const version = core.getInput("version", { required: true }).toString();
    await installPoetry(version);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
