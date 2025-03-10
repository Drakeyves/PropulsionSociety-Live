# Git Push Guide

This document outlines the exact steps to push this project to the GitHub repository.

## Steps to Push to GitHub

1. Check if remote is already set up:
```bash
git remote -v
```

2. If no remote exists or you need to change it, remove any existing remote:
```bash
git remote remove origin
```

3. Add the GitHub repository as the remote origin:
```bash
git remote add origin https://github.com/Drakeyves/PropulsionSociety-Live.git
```

4. Push the code to the GitHub repository:
```bash
git push -u origin main
```

5. Verify the remote connection:
```bash
git config --get remote.origin.url
```

The output should be: `https://github.com/Drakeyves/PropulsionSociety-Live.git`

## Common Issues

- If you encounter an error saying "remote origin already exists", use the remove command in step 2 before adding the new remote.
- If you're pushing to a different branch, replace `main` with your branch name in step 4. 