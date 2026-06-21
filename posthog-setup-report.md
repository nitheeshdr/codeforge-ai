# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CodeForge AI. PostHog was already partially set up (pageview tracking, exception capture, and a server-side client). This run extended it with 13 targeted business events spanning the full user lifecycle: sign-up and login, onboarding completion, code execution and submission, frontend challenge submission, contest joining, AI mentor interaction, interview feedback requests, subscription trial starts, paid subscription purchases, cancellations, and community question contributions. Client-side events use `posthog.identify()` at login/register to link anonymous sessions to users by email. Server-side events use `session.user.id` as the `distinctId` via the existing `getPostHogServer()` singleton.

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired after a user successfully creates an account and is signed in via email or OAuth. | `src/features/auth/register-form.tsx` |
| `user_logged_in` | Fired after a user successfully signs in via email credentials. | `src/features/auth/login-form.tsx` |
| `onboarding_completed` | Fired on the server when a user finishes onboarding and saves their goal, level, and preferences. | `src/app/api/onboarding/route.ts` |
| `code_run` | Fired on the server when a user runs their code against visible test cases or custom input. | `src/app/api/execute/route.ts` |
| `code_submitted` | Fired on the server when a user submits a DSA problem solution for full grading; includes status and whether it's a first-time solve. | `src/app/api/submissions/route.ts` |
| `challenge_submitted` | Fired on the server when a user submits a frontend challenge for AI review; includes score and pass/fail verdict. | `src/app/api/challenges/submit/route.ts` |
| `contest_joined` | Fired on the server when a user joins a contest. | `src/app/api/contests/[slug]/join/route.ts` |
| `ai_mentor_messaged` | Fired on the server when a user sends a message to the AI mentor; includes the action type and context. | `src/app/api/ai/chat/route.ts` |
| `interview_feedback_requested` | Fired on the server when a user requests AI feedback at the end of a mock interview session. | `src/app/api/ai/interview-feedback/route.ts` |
| `trial_started` | Fired on the server when a user activates a free trial for a paid plan. | `src/app/api/subscription/start-trial/route.ts` |
| `subscription_purchased` | Fired on the server after a Razorpay payment signature is verified and the user's plan is activated. | `src/app/api/subscription/verify/route.ts` |
| `subscription_cancelled` | Fired on the server when a user cancels their subscription renewal. | `src/app/api/subscription/cancel/route.ts` |
| `question_contributed` | Fired on the server when a user successfully uploads one or more community-contributed questions. | `src/app/api/questions/contribute/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/360073/dashboard/1741394)
- [New User Registrations (wizard)](https://us.posthog.com/project/360073/insights/Asc5yRIZ)
- [Code Submission Outcomes (wizard)](https://us.posthog.com/project/360073/insights/Xtj44Nqg)
- [AI Mentor Usage (wizard)](https://us.posthog.com/project/360073/insights/t7RKfRTw)
- [Subscription Conversion Funnel (wizard)](https://us.posthog.com/project/360073/insights/7pk8ZGsI)
- [Subscription Cancellations (wizard)](https://us.posthog.com/project/360073/insights/XM6KkJDt)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called on fresh email login/register only. OAuth sign-ins and returning sessions do not re-identify, which means returning users may accumulate anonymous distinct IDs between sessions. Consider adding an `identify` call in a layout or session hook that fires on every authenticated page load.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
