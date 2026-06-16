import { cache } from "react";
import { auth } from "./auth";

// Deduplicates auth() within a single request render tree.
// Both (platform)/layout.tsx and individual pages call this —
// React cache() ensures the JWT is only decrypted once per request.
export const getSession = cache(auth);
