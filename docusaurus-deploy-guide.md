
# 🚀 Docusaurus Deployment via SSH on Windows (GitHub Pages)

This guide outlines all steps to deploy a Docusaurus site to GitHub Pages using SSH in a **Windows environment**.

---

## 📁 1. Initialize Git Repository & Commit Code

```bash
git init
git remote add origin git@github.com:KamuKamlesh08/megatron-dev-docs.git

git add .
git commit -m "Initial commit"
git push -u origin main
```

---

## 🔐 2. Generate SSH Key (If not already created)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

> Press enter on all prompts to use default location.

---

## 📋 3. Add SSH Key to GitHub

- Open the file:
  ```bash
  notepad %USERPROFILE%\.ssh\id_ed25519.pub
  ```
- Copy the contents and add it to:
  - **GitHub → Settings → SSH and GPG keys → New SSH Key**

---

## ✅ 4. Verify SSH Authentication with GitHub

```bash
ssh -T git@github.com
```

> If successful:
> `Hi KamuKamlesh08! You've successfully authenticated, but GitHub does not provide shell access.`

---

## ⚙️ 5. Install `cross-env` for Windows Compatibility

```bash
npm install cross-env --save-dev
```

---

## 🛠️ 6. Update `package.json` for Deploy Script

```json
"scripts": {
  ...
  "deploy": "cross-env USE_SSH=true docusaurus deploy"
}
```

---

## 🌿 7. Create Empty `gh-pages` Branch (only once)

```bash
git checkout --orphan gh-pages
git reset --hard
git commit --allow-empty -m "Initial gh-pages commit"
git push origin gh-pages
git checkout main
```

---

## 🚧 8. Build and Deploy the Site

```bash
npm run build
npm run deploy
```

> ✅ Output:
> ```
> [SUCCESS] Generated static files in "build".
> [INFO] git push --force origin gh-pages
> ```

---

## 🌐 9. Enable GitHub Pages

Go to:

> **Repo → Settings → Pages → Source → `gh-pages` branch → /root → Save**

---

## 🔗 Final Live Site

[https://KamuKamlesh08.github.io/megatron-dev-docs/](https://KamuKamlesh08.github.io/megatron-dev-docs/)
