# Url Shortener App

A simple book review service build with NestJS.

### About

This project allows users to create, get one, get all books and add reviews for specified book. Average rating is calculated for each book based on its reviews. Project is build using NestJS opinionated architecture using dependency injection. For data persistence SQLite is selected for the sake of simplicity and TypeORM to abstract SQL. Migration process is preferred instead using syncronize=true method for database table structure modification.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [API Reference](#api-reference)
- [Swagger](#swagger)

## Installation

#### Clone the repository
```bash
git clone https://github.com/anarbyrm/BookCommentingService.git
```

#### Navigate into the directory
```bash
cd ./BookCommentingService
```

#### Build and up the project
```bash
npm start
```

You are ready to use project endpoints.

## Features

- Book and review create and listings
- SQLite database support for persistence and typeorm with migrations
- Swagger docs

## API Reference

| Endpoint                     | Method | Description                     |
| -----------------------------| ------ | --------------------------------|
| `/api/books`                 | POST   | Creates new book                |
| `/api/books`                 | GET    | Fetch all books with reviews    |
| `/api/books/:bookId`         | GET    | Fetch one book with reviews     |
| `/api/books/:bookId/reviews` | GET    | Create a review for a book      |

## Swagger

All endpoints can be inspected in swagger docs. It can be accessed over `localhost:3000/swagger`.
