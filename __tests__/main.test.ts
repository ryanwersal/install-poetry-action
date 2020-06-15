import { installPoetry } from "../src/poetry";
import { saveCache, restoreCache } from "@actions/cache";

jest.mock("@actions/cache");
(restoreCache as any).mockResolvedValue(undefined);

describe("installPoetry", () => {
  it("installs specified poetry version", async () => {
    await installPoetry({
      poetryVersion: "1.0.5",
    });
  });
});
