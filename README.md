# Project Structure

```text
project/
  frontend/
    assets/
      icons.js
    data/
      diseases.json
    pages/
      index.html
      diagnose.html
      diseases.html
      education.html
      history.html
      safety.html
      about.html
    styles/
      styles.css
    js/
      app.js
    README.md
  backend/
    app.py
    requirements.txt
    README.md
  README.md
```

## Prerequisite (Windows)

Install Python first, then open a new terminal and verify:

```powershell
python --version
py --version
```

If `python` is not found, use `py` in all commands below.

## Run Frontend (Windows)

```powershell
cd C:\projects\project\frontend
py -m http.server 8080
```

Open in browser:

- `http://127.0.0.1:8080/pages/index.html`

## Run Backend (Windows)

```powershell
cd C:\projects\project\backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py app.py
```

Test backend in browser:

- `http://127.0.0.1:5000/`
- `http://127.0.0.1:5000/health`

## Run From Project Root (Alternative)

```powershell
cd C:\projects\project
py backend\app.py
```

## Common Errors and Fixes

`ERROR: Could not open requirements file: requirements.txt`

- You are in the wrong folder. Run:

```powershell
cd C:\projects\project\backend
py -m pip install -r requirements.txt
```

`can't open file 'C:\\projects\\project\\app.py'`

- `app.py` is in `backend`. Run:

```powershell
cd C:\projects\project\backend
py app.py
```

or:

```powershell
cd C:\projects\project
py backend\app.py
```

PowerShell blocks venv activation

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then activate again:

```powershell
.\.venv\Scripts\Activate.ps1
```

Note: Backend is currently a placeholder; model training and `/predict` endpoint will be added later.
