import * as core from "@actions/core";
import { installPoetry } from "./poetry";
import { strToBool } from "./convert";

const run = async () => {
  try {
    const poetryVersion = core.getInput("poetry-version", { required: true });
    const createVirtualenv = strToBool(core.getInput("create-virtualenv"));
    const createVirtualenvInProject = strToBool(
      core.getInput("virtualenv-in-project")
    );

    await installPoetry({
      poetryVersion,
      createVirtualenv,
      createVirtualenvInProject,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
