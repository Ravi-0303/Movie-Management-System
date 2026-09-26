# 🎬 Movie Management System

A Netflix/IMDb-style movie management application built with HTML, CSS, JavaScript and JSON Server.

## Features

- Add movie
- Update movie
- Delete movie
- Search by title/language
- Filter by genre
- Sort by rating/year
- View movie details
- Mark/unmark favourites
- Responsive movie-card UI
- Custom API and validation exception classes

## Required Software

- Node.js
- VS Code (recommended)
- A browser

## Folder Structure

```text
movie-management-system/
├── views/
│   ├── index.html
│   └── details.html
├── css/
│   ├── style.css
│   └── layout.css
├── js/
│   ├── service/
│   │   ├── movieService.js
│   │   └── apiConfig.js
│   ├── main.js
│   └── utils.js
├── exception/
│   ├── apiException.js
│   └── validationException.js
├── assets/
└── db.json
```

## How to Run

### 1. Open the project folder

Open `movie-management-system` in VS Code.

### 2. Install JSON Server

Open the VS Code terminal:

```bash
npm install -g json-server
```

If your system does not allow global installation, use:

```bash
npx json-server --watch db.json --port 3000
```

### 3. Start the database API

From the project root:

```bash
json-server --watch db.json --port 3000
```

The API will be available at:

```text
http://localhost:3000/movies
```

### 4. Open the website

Use VS Code Live Server on:

```text
views/index.html
```

For example, with Live Server the page may open at:

```text
http://127.0.0.1:5500/views/index.html
```

Do not open the HTML file directly with `file://` because browser security can block API requests.

## API Operations

The frontend uses these REST operations:

- `GET /movies` → list movies
- `GET /movies/:id` → movie details
- `POST /movies` → add movie
- `PUT /movies/:id` → update movie
- `DELETE /movies/:id` → delete movie

## Technologies

- HTML5
- CSS3
- JavaScript ES6
- JSON Server
- REST API
- JSON database

## Project Flow

```text
HTML/CSS UI
     ↓
JavaScript event handlers
     ↓
MovieService
     ↓
REST API / JSON Server
     ↓
db.json
```


LOGIN: There are no fixed/default usernames. Each user must create their own account from register.html.
