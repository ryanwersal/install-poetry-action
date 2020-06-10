import { installPoetry } from "../src/poetry";
import process from "process";
import cp from "child_process";
import path from "path";

describe("installPoetry", () => {
  it("installs specified poetry version", async () => {
    await installPoetry("1.0.5");
  });
});
