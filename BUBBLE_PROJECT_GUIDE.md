# Bubble — product, build history, and hackathon guide

**Project snapshot · November 22, 2026 · India Standard Time (IST)**

Bubble is a personal AI interpreter for travelers. The intended experience is a two-way conversation on one phone, with spoken translations online and readable translations offline on a prepared device. **Today the working app covers the splash screen and three onboarding screens.** The interpreter, Firebase integration, and dedicated web app are upcoming work.

**Competition goal:** the $10,000 Grand Prize at Google’s #BuildHybridAI 2026. **Submission deadline:** December 1 at 3:30 a.m. IST. **Proposed team target:** November 30 at 8:00 p.m. IST, leaving 7½ hours for upload or access issues. [Contest homepage](https://firebasehybridaihackathon.devpost.com/) · [Official rules](https://firebasehybridaihackathon.devpost.com/rules)

## Why build Bubble?

A traveler buying something needs to understand the answer as much as they need to ask the question. In a noisy shop, a misheard number can change a purchase. When reception drops between turns, asking both people to start over breaks the conversation. Bubble’s design gives each person a clear turn, makes the original and translated words visible, and keeps the exchange usable as connectivity changes.

The original example is a purchase in Japan. This is the target demo script.

| Speaker | What they say | What Bubble should deliver |
| --- | --- | --- |
| English-speaking traveler | “How much does this cost?” | Show and speak “これはいくらですか？” for the shopkeeper. |
| Japanese-speaking shopkeeper | “千円です。” | Show “It’s 1,000 yen.” Speak it when playback is available. |
| Either speaker, after the connection drops | A fresh follow-up about the purchase | Keep the earlier turns visible and translate the new turn locally on a supported device. |

The same interaction applies to ordering food, asking directions, checking into a hotel, and speaking with locals. The English product line is **“Speak your language. Connect with anyone.”** The splash uses **“Break language barriers instantly.”**

## Product scope and reasons

| Feature | Priority and status | Design decision and reason |
| --- | --- | --- |
| Voice translation and live conversation | Core, planned | Two labeled tap-to-talk controls on one phone establish the speaker and translation direction. Show both texts, allow correction, and replay a translation without recording Bubble’s own voice. |
| Offline voice-to-text (“Mode B”) | Core, planned | Recognize speech locally, translate the transcript on device, and display it. A traveler can still show the other person a readable answer. Test speech recognition and translation independently for each language. |
| Online voice-to-voice | Core, planned | Capture speech, translate through Firebase AI Logic, and play the translated text aloud. Start with individual turns. Streaming audio via Gemini Live is a later option if interruption, transcription, latency, and model access are reliable. |
| Smart phrasebook | Supporting, planned | Bundle reviewed phrases for restaurants, shopping, transportation, hotels, and emergencies. Include ways to recover from misunderstanding, such as “Could you show me the price?” Offer playback where a voice is available. |
| Camera translation | Stretch, planned | Begin with one photo of a menu item, sign, or product label. Translate the selected text into the traveler’s language. Prioritize it after the two-person conversation works. |

## What happened during development

1. **Product and platform choice.** The founder proposed Android and web in one repository, aiming for the Grand Prize. The plan paired Expo/React Native with a future Next.js app. Offline voice-to-text and online voice-to-voice became the central hybrid use case.
2. **Build order.** An early plan suggested a short real-device inference test before UI work. The founder chose to build and review the four mobile screens first, then move to web and inference. The feasibility test is still open.
3. **First mobile build.** An npm workspace was created with an Expo app in `apps/mobile`. The reference established a pale aqua background, teal gradients, two overlapping bubbles, bottom waves, large type, rounded buttons, and three progress dots. The initial artwork used crops from the supplied reference.
4. **Preview and emulator setup.** Android and browser bundles were exported. A self-contained phone-width HTML preview was created after a localhost preview timed out in the in-app browser. Android Studio showed a Pixel 9a API 37 virtual device. This provided a way to review the UI separately from the Flutter project also open in the IDE.
5. **Quality and overlap feedback.** Enlarged crops looked soft. The onboarding scenes were redrawn as scalable illustrations. The screen layout gave Skip, the content, and the footer separate space. A 300 ms slide-and-fade transition was added. This pass also reduced the artwork and type.
6. **Sizing correction.** The founder preferred the earlier scale and splash treatment. The original larger sizing was restored for illustrations, headings, body copy, and buttons. The founder then asked specifically for a sharper logo. The current splash draws the two overlapping teal bubbles with scalable shapes, gradients, and a highlight at the earlier display size.
7. **Latest visual decision.** The traveler reference measured **387 × 300 pixels**, with approximately **300 × 224 pixels of visible artwork**. The microphone and travel scenes were adjusted to match the traveler scene’s visible width around their existing centers. These measurements describe the supplied screenshot. The app scales responsively. Future edits should preserve the chosen size, colors, and positions unless the founder requests a change.

### Current behavior and files

The splash advances after 6.0 seconds. The three cards are **Translate Anywhere**, **Real-Time Voice Translation**, and **Your Travel Companion**. Next advances between cards. Skip and Get Started open the completion dialog, which offers Replay preview. The onboarding descriptions portray the product vision. The latest Android and browser bundle exports succeeded. End-to-end translation, handset performance, and visual acceptance of the latest revision still need evidence.

| Repository entry | Purpose |
| --- | --- |
| [Root package manifest](package.json) and [lockfile](package-lock.json) | npm workspaces, reproducible dependency installation, and launch commands |
| [Mobile app](apps/mobile/App.js) | Splash logo and waves, layout, animated navigation, and completion dialog |
| [Illustrations](apps/mobile/Illustration.js) | Scalable traveler, microphone, and globe/plane artwork |
| [Mobile assets](apps/mobile/assets/) | Earlier reference-derived bitmap assets. Review provenance and distribution rights before publishing. |
| [Mobile dependencies](apps/mobile/package.json) and [Expo config](apps/mobile/app.json) | Expo SDK 58, React 19.3, React Native 0.88.1, SVG, gradients, safe areas, and browser preview. Android package ID is `app.bubble.interpreter`. |
| [Startup README](README.md) | Local development instructions |

From the repository root on Windows, a fresh checkout can run:

```powershell
npm.cmd ci
npm.cmd run mobile
```

In Android Studio, open **Running Devices → + → Pixel 9a API 37.0** if that virtual device exists, or create a phone in Device Manager. Wait for the Android home screen, then press **a** in the Expo terminal. Press **r** to reload. The current UI can run in a compatible Expo Go client. Use `npm.cmd run preview` for the Expo browser preview. A dedicated Next.js project and an installable judge build are separate deliverables.

## Proposed architecture and offline behavior

The initial recommendation included pnpm and TypeScript. The delivered workspace uses **npm and JavaScript**. Continue with its lockfile. For the planned web app, use Next.js client components for microphone access and Firebase’s browser SDK. For Android native inference, plan an Expo development build with a Kotlin bridge to the supported Firebase Android SDK. Share language direction, turn state, prompts, and phrasebook content as both apps need them. Keep capture, playback, and capability detection specific to each platform. Firebase client SDKs can handle inference directly. A custom backend is a future decision. [Android hybrid guide](https://firebase.google.com/docs/ai-logic/hybrid/android/get-started) · [Web hybrid guide](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started)

| Condition | Intended behavior |
| --- | --- |
| Supported local model and speech pack are ready | Recognize locally and translate a fresh utterance through Firebase on device. Report the actual inference source returned by the SDK. |
| Local translation is unavailable and cloud use is allowed | Use the configured cloud fallback, keep the same conversation, and label the completed turn. |
| A user selects private/offline mode | Require local recognition and local-only translation. Explain which capability needs preparation if a turn cannot run. |
| Connection drops after speech capture | Preserve the transcript. Attempt the unfinished translation locally when supported. Avoid duplicate cards or playback after a retry. |
| Offline dictation is unavailable | Offer typing if local text translation works. If the model is unavailable too, offer bundled phrases. |
| The user wants spoken output offline | Offer it only when a suitable local voice is installed. Offline translated text is the baseline promise. |

**First technical proof.** Pick a supported physical Android phone or supported desktop Chrome installation. Record device, OS/browser, SDK and model setup, language pair, and preparation downloads. Translate a new typed sentence locally with the network disabled. Then test local dictation in both directions. Finally, trigger an online cloud fallback and inspect the returned inference source. An emulator UI demo establishes layout and navigation only. [Firebase inference modes](https://firebase.google.com/docs/ai-logic/hybrid/android/configuration-options)

English ↔ Japanese is the intended shopping example. The Android guidance consulted during planning identified English and Korean as validated for local inference. Validate Japanese recognition, translation, and playback separately before advertising offline support. If the device cannot deliver a reliable Japanese exchange, demonstrate the verified offline pair and identify Japanese as online wherever that has been tested. Proposed storage is session-local conversation history and a bundled phrasebook. Decide explicitly whether cloud speech will transmit audio or only a transcript, and describe the implemented path accurately. [Android capabilities](https://firebase.google.com/docs/ai-logic/hybrid/android/get-started) · [Firebase audio options](https://firebase.google.com/docs/ai-logic/generate-audio)

## Hackathon field guide

Google sponsors the online contest and Devpost administers it. At least one supported platform is required. The brief lists Gemini Nano 4 through Firebase AI Logic for Android or Chrome and Apple Foundation Models through Firebase AI Logic for iOS. Multiple working platforms receive strong consideration for the Grand Prize. Bubble’s intended order is Android first, then Chrome. App Check is required, and debug tokens are accepted for submission. Remote Config, Firestore, and Authentication are optional additions. Coding assistants and the team’s choice of IDE are permitted. [Contest brief](https://firebasehybridaihackathon.devpost.com/) · [Official rules](https://firebasehybridaihackathon.devpost.com/rules)

### Dates to keep

| Event | Pacific time in the rules | India time |
| --- | --- | --- |
| Submissions open | Nov 11, 1:30 p.m. | Nov 12, 3:00 a.m. |
| Final optional quota request | Nov 25, 10:00 a.m. | Nov 25, 11:30 p.m. |
| Final quota accounts issued | Nov 27, date only | Exact local delivery time unspecified |
| Submissions close | Nov 30, 2:00 p.m. | **Dec 1, 3:30 a.m.** |
| Judging opens | Dec 10, 9:00 a.m. | Dec 10, 10:30 p.m. |
| Judging closes | Dec 16, 2:00 p.m. | **Dec 17, 3:30 a.m.** Keep judge access available through this time. |
| Winners announced, approximately | Dec 21, noon | Dec 22, 1:30 a.m. |

The Nov 11 and Nov 18 quota windows have passed. The optional final allocation lasts four days from issuance, is subject to approval, and has usage limits. Usage beyond the allocation can incur fees. Plan judge access independently of this temporary account. No purchase is required to enter. The event’s Resources page and Devpost Discord provide setup and organizer support. [Rules and quota form](https://firebasehybridaihackathon.devpost.com/rules) · [Event resources](https://firebasehybridaihackathon.devpost.com/resources)

### Judging and prizes

Entries first pass a viability and submission-requirements check. Judges then score four equally weighted criteria from 1 to 5 and average the scores. The listed order also determines the first tie-break comparisons. Proposed evidence for Bubble follows.

| Criterion | What to show a judge |
| --- | --- |
| Technological implementation | A fresh local turn in airplane mode, a real cloud turn, the SDK-reported source, and the code that calls Firebase AI Logic. |
| Design | Two people passing one phone, identifying their own mic, reading the reply, and replaying or correcting a turn without coaching. |
| Potential impact | A traveler completes a purchase and understands the amount. Record actual errors and time to readable translation during a two-person test. |
| Quality of the idea | Show the connection dropping between the question and the answer, and the purchase continuing in the same conversation. |

The $30,000 pool comprises $10,000 for the Grand Prize, $7,000 and $4,000 for the runners-up, and $3,000 each for Best Android, Best Web/Chrome, and Best iOS. The rules allow one grand prize and up to one platform award per submission. The Grand Prize and first runner-up also list an interview and featured blog post. [Prize and judging details](https://firebasehybridaihackathon.devpost.com/rules)

### Eligibility, ownership, and administration

- Confirm eligibility for every entrant. Section 3 covers age of majority (at least 20 in Taiwan), residence, sanctions/export restrictions, internet access on Nov 11, contest-related employment and households, government employment, and conflicts of interest. Entering for an employer requires its consent. Individual eligibility and registration have not been verified. [Official eligibility rules](https://firebasehybridaihackathon.devpost.com/rules)
- Individuals, eligible teams, and organizations can enter. List all team members on Devpost and designate a representative for a team or organization. Distinct projects can be submitted separately.
- New projects and significantly updated existing projects qualify under the stated conditions. Describe work completed during the contest, disclose incorporated pre-existing work, and check rights to third-party code, assets, APIs, data, and recordings. Existing publicly used apps must explain the value they contributed. Review restrictions on prior sponsor support and implied third-party endorsement.
- Entrants retain ownership and grant the organizer rights to evaluate and publicize submissions. Registration involves sharing participant information with Google and Devpost. Keep private information out of public demo materials.
- Monitor the representative’s email. The supplied rules specify three business days to respond to a potential-winner notification and ten business days for requested verification documents. The representative distributes team winnings. Applicable taxes and fees are the winner’s responsibility. [Official rules, including prize verification and privacy](https://firebasehybridaihackathon.devpost.com/rules)

## Working plan from November 22

These are suggested targets from the project discussion. Only the onboarding milestone has a recorded build result.

| Target | Work and exit check |
| --- | --- |
| Nov 22 | Review mobile onboarding. Identify the physical device or desktop Chrome setup for the first local Firebase test. Record the result or the specific capability that is missing. |
| Nov 23–24 | Build the two-speaker conversation UI against mock turns, then offline readiness and phrasebook. Test microphone denial, correction, cancellation, and network loss. Review mobile before extending the design to web. |
| Nov 25–26 | Integrate App Check, speech capture, Firebase hybrid translation, and playback. Validate both directions, offline-only behavior, and cloud fallback. Decide on the optional quota by Nov 25. |
| Nov 27–28 | Test noisy input, prices, quantities, negation, missing packs, reconnection, and first use on a clean device. Record measured latency and translation failures. Choose submitted platforms using actual test results. |
| Nov 29–30 | Prepare a clean install, free judge access, licensed public repository, instructions, video, and Devpost description. Submit by the internal target and record the submitted commit and URLs. |

### Proposed three-minute demonstration

| Time | Footage to capture after implementation |
| --- | --- |
| 0:00–0:20 | Introduce the traveler, the shopkeeper, and the purchase. Show the languages and the shared-phone controls. |
| 0:20–1:05 | Speak the question and answer. Let viewers hear the translation and read the price on the card. |
| 1:05–1:55 | Switch to airplane mode on the prepared device. Speak a new follow-up and show its local result alongside the previous turns. |
| 1:55–2:35 | Demonstrate cloud fallback under a real supported condition. If Chrome is submitted, show the working Chrome app. |
| 2:35–2:55 | Show how a judge can try the app, which language pair was tested, and where the Firebase integration lives. Leave five seconds of margin. |

## Submission checklist

- [ ] Confirm registration, entrant eligibility, team details, and the selected platform categories.
- [ ] Demonstrate the required hybrid model through an actual runtime Firebase AI Logic call. Configure App Check and document the exact device and model preparation steps.
- [ ] Provide a working URL, functioning demo, or installable test build. Test from a clean start. Provide judge credentials if private. Keep testing free and accessible through the end of judging.
- [ ] Publish the source and required assets on GitHub or GitLab. Include reproducible setup, judging instructions, the value proposition, and a detectable root open-source license. Apache is preferred. The current workspace listing has no root license file.
- [ ] Disclose external assets and pre-existing work. Check the original screenshot-derived image files before releasing the repository. Exclude production keys, live cloud secrets, confidential data, and personal information from the repo, submission, and testing instructions.
- [ ] Write the English Devpost description with the audience, value, demonstrated features, actual Firebase usage, and work done during the contest. Clearly identify device, language, and connectivity prerequisites.
- [ ] Upload a publicly visible YouTube walkthrough of three minutes or less in English or with English subtitles. Show each submitted platform running. Judges may evaluate the video and description without opening the app.
- [ ] Verify the repository, build, and video links in a signed-out session. Submit the completed Devpost form before the deadline and save the confirmation. Later commits ordinarily fall outside judging unless the organizer permits a modification in writing.

**Still to record:** team or individual registration, intended public repository URL, final license choice, Firebase project configuration, tested device and language matrix, measured results, judge-access URL or APK, video URL, and Devpost entry URL. A package export is evidence of a successful build. Each submission claim should also point to a reproducible interaction on the relevant platform.
