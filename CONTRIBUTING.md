# Contributing Guide

This repository is designed to be worked on inside a local clone of the GitHub project. If you are
using an environment such as GitHub Codespaces or an AI coding assistant, follow the steps below to
create a pull request (PR) that only contains the source changes you intend to propose.

## 1. Prepare your environment

1. Install dependencies (only required once per clone):
   ```bash
   pnpm install
   ```
2. Apply any database migrations and generate the Prisma client when needed:
   ```bash
   pnpm prisma migrate deploy
   pnpm prisma generate
   ```
3. Run the seed script if you need sample data locally:
   ```bash
   pnpm ts-node prisma/seed.ts
   ```

## 2. Work on a feature branch

1. Make sure you are on top of the latest `work` branch:
   ```bash
   git checkout work
   git pull
   ```
2. Create a new branch for your work:
   ```bash
   git checkout -b feature/my-change
   ```
3. Implement your changes and run the project locally as needed with `pnpm dev`.

## 3. Keep binary artefacts out of your commits

GitHub rejects extremely large diffs, and binary build artefacts make review difficult. To ensure only
source files are part of your PR:

1. Verify the repository status before committing:
   ```bash
   git status -sb
   ```
   Files in `node_modules/` (and other generated folders listed in [.gitignore](.gitignore)) already
   appear as ignored entries and **must not** be added.
2. If you accidentally added a binary or generated file, remove it from the staging area:
   ```bash
   git rm --cached path/to/file
   ```
3. For assets that truly need to be versioned (for example, images too large for regular Git), track
them with [Git LFS](https://git-lfs.com/) instead of committing the binary directly:
   ```bash
   git lfs track "path/to/asset"
   git add .gitattributes path/to/asset
   ```

## 4. Run checks before committing

Running the project's automated checks locally helps ensure the PR passes CI:

```bash
pnpm lint
pnpm test
```

## 5. Commit and push

1. Stage the files you want to include:
   ```bash
   git add path/to/file.tsx path/to/another-file.ts
   ```
2. Commit with a descriptive message:
   ```bash
   git commit -m "feat: add new booking flow"
   ```
3. Push the branch to your fork and open a PR on GitHub:
   ```bash
   git push origin feature/my-change
   ```

Following this checklist will keep binary artefacts out of your pull requests and make the review
process much smoother.
