# Task Tracker — End-to-End SDLC Learning Project

A deliberately small task management web app, built to learn — hands-on — the complete software delivery lifecycle: **Code → Local Machine → Git → GitHub → AWS → CI/CD → Automatic Deployment**.

This was my first AI-assisted development project spanning the full stack, from writing the first line of UI code to watching a `git push` automatically redeploy a live server on AWS. I worked through it interactively with Claude acting as a hands-on instructor — I wrote and ran every command myself, rather than having the project built for me — because the goal wasn't the app itself, it was building working knowledge of the whole delivery pipeline.

## What the app does

A minimal task tracker: view a list of tasks, add a task, mark a task complete, and delete a task. No database, no authentication, no containers — intentionally simple, so the *lifecycle* stayed the focus rather than the feature set.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (vanilla — no framework) |
| Backend / API | Node.js with the Express.js framework |
| Data | In-memory storage (no database in this version, by design) |
| Version control | Git, hosted on GitHub |
| Cloud hosting | AWS Lightsail — an Ubuntu 24.04 LTS virtual server |
| Process management | PM2 (keeps the Node.js process running and auto-restarting on the server) |
| CI/CD | GitHub Actions |
| Local command line | Windows PowerShell |

## Architecture

```
Developer
   |
Local Git
   |
GitHub
   |
GitHub Actions (CI/CD Pipeline)
   |    \
   |     -> Build (npm install)
   |     -> Test (automated smoke test)
   |     -> Deploy (SSH into AWS, git pull, restart app)
   |
AWS Lightsail (Ubuntu server, Node.js + Express, PM2)
   |
Web Application
   |
User / Browser
```

## The pipeline

Every push to `main` triggers an automated pipeline:

1. **Build** — a fresh GitHub-hosted runner checks out the code and installs dependencies (`npm install`).
2. **Test** — an automated smoke test starts the server as a real process and confirms the API responds correctly, before anything is allowed to deploy.
3. **Deploy** — only if the test passes, GitHub Actions securely connects to the AWS server (credentials stored in encrypted GitHub Secrets, never in the codebase) and pulls the latest code, reinstalls dependencies, and restarts the running application with zero manual steps.

## What this project actually demonstrates

Beyond the code itself, this project involved navigating the kind of real-world friction that a written tutorial usually skips past:

- **Adapting a delivery plan mid-flight** — the original AWS deployment target (App Runner) turned out to be closed to new customers partway through the project, requiring a same-day pivot to a different AWS service (Lightsail) without derailing the timeline.
- **Security-first habits under pressure** — when a credential was briefly exposed in the wrong place, the response was to revoke and rotate it immediately rather than assume it was fine, and to route all deployment credentials through GitHub's encrypted Secrets store instead of ever committing them.
- **End-to-end ownership** — from local environment setup and version control through cloud infrastructure and release automation, with no step outsourced or skipped.

## Repository structure

```
task-tracker/
├── .github/workflows/deploy.yml   (CI/CD pipeline definition)
├── backend/
│   ├── server.js                  (Express API)
│   ├── test.js                    (automated smoke test)
│   └── package.json
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Running it locally

```bash
cd backend
npm install
node server.js
```

Then open `http://localhost:3000` in a browser.

---

*Next planned step: adding basic DevSecOps practices — dependency vulnerability scanning, secret detection, and a pipeline quality gate.*
