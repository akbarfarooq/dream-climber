# The Dream Climber

### An Interactive Educational Psychology Simulation

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/State-Zustand%205-brown.svg)](https://github.com/pmndrs/zustand)
[![Three.js](https://img.shields.io/badge/Visuals-Three.js%20%2F%20R3F-black?logo=three.js)](https://threejs.org)

**The Dream Climber** is an educational, story-driven web simulation designed to bridge developmental psychology and interactive gameplay. The project translates established psychological frameworks into experiential scenario challenges, empowering learners aged 10–15 to understand how everyday behavioral choices impact their trajectory toward achieving personal aspirations and self-actualization.

---

## Project Vision & Educational Purpose

Traditional educational approaches to emotional intelligence, resilience, and personal goal-setting often rely on static lectures or abstract textbooks. **The Dream Climber** transforms these concepts into active decision-making scenarios:

1. **Experiential Learning**: Learners do not merely memorize psychological definitions; they inhabit a climber facing realistic social, academic, and personal dilemmas.
2. **Consequence-Driven Reflection**: Every decision provides immediate, evidence-based feedback explaining the underlying psychological rationale.
3. **Agency & Self-Efficacy**: By selecting an authentic dream (Doctor, Athlete, Artist, Engineer, Teacher, or Scientist), learners connect their in-game choices to their real-world ambitions.
4. **Resilience Building**: The mountain-climbing metaphor visually reinforces that obstacles, plateau periods, and feedback are natural components of personal mastery.

---

## Theoretical & Psychological Frameworks

The core pedagogical curriculum is anchored in five foundational psychological pillars:

```text
                         [ THE SUMMIT ]
                               ▲
                              / \
                             /   \
  ──────────────────────────/     \──────────────────────────
  LEVEL 7 │ PEAK 7: SELF-ACTUALIZATION SUMMIT
          │ Purpose, Lifelong Growth & Meaningful Contribution
  ────────┼──────────────────────────────────────────────────
  LEVEL 6 │ PEAK 6: DREAM VALLEY
          │ Authenticity, Career Passion & Creative Resourcefulness
  ────────┼──────────────────────────────────────────────────
  LEVEL 5 │ PEAK 5: CRITICISM RIDGE
          │ Constructive Feedback, Openness & Growth Mindset
  ────────┼──────────────────────────────────────────────────
  LEVEL 4 │ PEAK 4: CONFIDENCE CLIFF
          │ Self-Esteem, Failure Recovery & Psychological Resilience
  ────────┼──────────────────────────────────────────────────
  LEVEL 3 │ PEAK 3: FRIENDSHIP HILL
          │ Belonging, Social Empathy & Healthy Peer Boundaries
  ────────┼──────────────────────────────────────────────────
  LEVEL 2 │ PEAK 2: SAFETY PEAK
          │ Personal Boundaries, Physical Security & Anti-Bullying
  ────────┼──────────────────────────────────────────────────
  LEVEL 1 │ PEAK 1: BASIC SURVIVAL PEAK
          │ Physiological Foundation, Sleep Hygiene & Rest Recovery
  ───────────────────────────────────────────────────────────
                        [ BASE CAMP ]
```

### 1. Maslow's Hierarchy of Needs (Abraham Maslow)
Progression mirrors Maslow’s pyramid. A climber cannot reach self-actualization without first attending to physiological recovery, personal safety, social belonging, and self-esteem.

### 2. Growth Mindset Theory (Dr. Carol Dweck)
Scenarios encourage players to view challenges and errors not as permanent labels of inability, but as diagnostic information essential for intellectual and skill development.

### 3. Self-Efficacy Theory (Albert Bandura)
Climbing success is directly tied to Bandura’s four sources of self-efficacy: mastery experiences, vicarious role modeling, verbal encouragement, and emotional self-regulation.

### 4. Self-Determination Theory (Deci & Ryan)
Fosters intrinsic motivation by honoring the player's autonomy (choosing their dream), competence (navigating difficult scenarios), and relatedness (resolving social conflicts).

### 5. Emotional Regulation & Locus of Control
Challenges teach internal locus of control—shifting focus from uncontrollable external circumstances to proactive personal responses.

---

## The 7 Mountains Curriculum

The game features **7 themed mountains** containing **35 real-life scenario challenges**:

| # | Mountain Name | Maslow / Psychological Dimension | Core Themes & Dilemmas Explored |
|---|---|---|---|
| **1** | **Basic Survival Peak** | Physiological Needs | Sleep hygiene before exams, nutrition, physical illness communication, rest after athletic exertion, optimizing study environments. |
| **2** | **Safety Peak** | Safety & Security Needs | Boundary enforcement, resisting peer extortion, cyberbullying response, property security, reporting threats to trusted authorities. |
| **3** | **Friendship Hill** | Belonging & Social Needs | Resisting truancy peer pressure, addressing social exclusion, welcoming new peers, integrity in friendship, active bystander courage. |
| **4** | **Confidence Cliff** | Self-Esteem Needs | Processing exam failure, accepting praise with grace, handling intellectual theft, recovering from public embarrassment, non-comparative motivation. |
| **5** | **Criticism Ridge** | Esteem & Feedback Receptivity | Public teacher corrections, parental disappointment, constructive peer feedback, separating helpful critique from unhelpful noise, coach evaluations. |
| **6** | **Dream Valley** | Emerging Self-Actualization | Balancing family expectations with personal passions, breaking daunting ambitions into actionable milestones, confronting doubt, overcoming resource scarcity. |
| **7** | **Self-Actualization Summit** | Peak Actualization & Contribution | Sustainable work-rest balance, calculated risk taking, crisis resilience, celebrating milestones, defining success through growth and meaningful contribution. |

---

## Gameplay Mechanics & Interactive Architecture

* **Dream Customization**: At the start of the climb, learners select their dream archetype:
  * 🩺 **Doctor** — Healing, empathy, and scientific dedication
  * 🏅 **Athlete** — Physical discipline, perseverance, and sportsmanship
  * 🎨 **Artist** — Creative expression, authenticity, and visual storytelling
  * ⚙️ **Engineer** — Systematic problem-solving and innovation
  * 📚 **Teacher** — Knowledge sharing, leadership, and community guidance
  * 🚀 **Scientist** — Empirical inquiry, curiosity, and research
* **Elevation & Character Animation**: Each correct response advances the climber visually along the mountain ridge using dynamic coordinate calculation.
* **Lives & Heart System**: Players begin each mountain with 3 lives, discouraging impulsive guessing and encouraging deep scenario deliberation.
* **Instant Formative Feedback**: Every selected option triggers an overlay explaining why the choice reinforces or hinders psychological well-being.
* **Smart Session Lifecycle**:
  * **Page Refreshes (F5)** preserve the active mountain, current question index, lives, and score without kicking the player out.
  * **Fresh Visits** to the URL automatically present the Title Screen first.
  * **Returning Player Detection**: Greets returning climbers by name and provides direct access back to the World Map or mountain progression.

---

## Screen Ecosystem

1. **Title & Overview Screen (`/` or `#/title`)**: Presents project credentials, simulation introduction, and adaptive session launch buttons.
2. **Welcome Screen (`#/welcome`)**: The artistic portal introducing *The Dream Climber* with 3D mountain silhouettes and animated cosmic particles.
3. **Setup Screen (`#/setup`)**: Identity and dream selection portal allowing learners to personalize their climbing experience.
4. **World Map Screen (`#/worldmap`)**: Interactive panoramic expedition map tracking completed ascents, unlocked peaks, and total scores.
5. **Game Screen (`#/game`)**: The summit simulation featuring interactive scenario cards, mood meters, dynamic weather (sunny, foggy, rainy, windy, stormy, sunrise), and climber SVG animations.
6. **Summit & Victory Screens (`#/summit`, `#/victory`)**: Celebratory milestones with custom audio fanfare upon completing individual peaks or mastering all 7 mountains.
7. **Psychology Reference Screen (`#/psychology`)**: Interactive reference compendium providing students and teachers with detailed breakdowns of Maslow's hierarchy, Growth Mindset, and Self-Efficacy.
8. **Learner Dashboard (`#/dashboard`)**: Comprehensive analytics tracking completed mountains, highest elevation scores, and individual growth milestones.
9. **About Screen (`#/about`)**: Pedagogical overview, educational objectives, and core mission.

---

## Technical Stack & Design System

* **Frontend Framework**: React 19 with Vite 6
* **Language**: TypeScript 5.8 (Strict type safety, zero emit errors)
* **Styling**: Tailwind CSS 4 with custom `@theme` variables (`--color-sky-night`, `--color-gold`, `--color-mt-dark`, `--font-display: Cinzel`)
* **3D Visuals & Graphics**: Three.js, React Three Fiber, React Three Drei, and TSParticles for atmospheric starfields
* **Motion & Transitions**: Motion (`motion/react`) for fluid screen-to-screen and element animations
* **State Management**: Zustand 5 with custom `localStorage` persistence and `sessionStorage` lifecycle coordination
* **Audio Synthesis**: Web Audio API oscillator synthesis generating dynamic tones for steps, correct answers, wrong answers, and summit celebrations without external audio file overhead
* **Icons**: Lucide React

---

## Repository Structure

```
the-dream-climber/
├── public/
│   └── favicon.svg               # Application icon
├── src/
│   ├── components/
│   │   ├── game/                 # Game visual systems
│   │   │   ├── ClimberCharacter.tsx # Climber avatar rendering & expressions
│   │   │   ├── LivesSystem.tsx   # Heart & vitality counter
│   │   │   ├── MoodMeter.tsx     # Climber emotional indicator
│   │   │   ├── Mountain3D.tsx    # Three.js 3D backdrop rendering
│   │   │   ├── MountainSVG.tsx   # Stylized SVG mountain path
│   │   │   └── ProgressBar.tsx   # Mountain elevation progression bar
│   │   ├── screens/              # Top-level screen views
│   │   │   ├── AboutScreen.tsx   # Project details & pedagogical overview
│   │   │   ├── DashboardScreen.tsx # Learner stats & achievement overview
│   │   │   ├── FailScreen.tsx    # Reflective retry & resilience view
│   │   │   ├── GameScreen.tsx    # Core scenario challenge & gameplay engine
│   │   │   ├── HowToPlayScreen.tsx # Instructions & gameplay controls
│   │   │   ├── PsychologyScreen.tsx # Educational theory library
│   │   │   ├── SetupScreen.tsx   # Climber name and dream selection
│   │   │   ├── SummitScreen.tsx  # Mountain completion celebration
│   │   │   ├── TitleScreen.tsx   # Title & introductory portal
│   │   │   ├── TransitionScreen.tsx # Inter-mountain narrative transition
│   │   │   ├── VictoryScreen.tsx # Game completion grand finale
│   │   │   ├── WelcomeScreen.tsx # Game title portal ("BEGIN YOUR JOURNEY")
│   │   │   └── WorldMapScreen.tsx # Expedition map with 7 peaks
│   │   └── ui/                   # Reusable interface components
│   │       ├── AnswerButton.tsx  # Scenario option buttons
│   │       ├── FeedbackOverlay.tsx # Pedagogical explanation modal
│   │       ├── FloatingClouds.tsx# Dynamic atmospheric cloud layers
│   │       ├── Navigation.tsx    # Responsive header & mobile drawer
│   │       └── ParticleBackground.tsx # Starfield & particle canvases
│   ├── data/
│   │   └── levels.ts             # 7 mountains, 35 scenario challenges, psych concepts
│   ├── services/
│   │   └── audioService.ts       # Web Audio API procedural sound engine
│   ├── store/
│   │   └── gameStore.ts          # Zustand global game state & persistence
│   ├── utils/
│   │   └── climber.ts            # Mathematical positioning & coordinate algorithms
│   ├── App.tsx                   # Screen orchestration, hash routing & lifecycle
│   ├── index.css                 # Typography, theme variables & glassmorphism
│   └── main.tsx                  # Application bootstrap
├── index.html                    # HTML root with Cinzel & Inter typography
├── package.json                  # Dependencies and metadata
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite build and plugin configuration
```

---

## Educational Notice & Usage

This application is an educational software simulation developed for experiential learning and developmental psychology study. All scenario content, psychological pedagogical progressions, and interface designs are curated to support youth psychological resilience and holistic development.
