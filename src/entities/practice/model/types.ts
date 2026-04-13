import { z } from "zod";
import { PracticeProblemSchema } from "../lib/schemas";

export type PracticeProblem = z.infer<typeof PracticeProblemSchema>;
