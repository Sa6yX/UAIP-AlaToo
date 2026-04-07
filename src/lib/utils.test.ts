import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("merges tailwind classes correctly", () => {
    expect(cn("px-2", "px-4", "text-sm", "text-lg")).toBe("px-4 text-lg");
  });
});
