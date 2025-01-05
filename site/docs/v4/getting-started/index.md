---
title: Introduction to `upper/db`
---

`upper/db` provides a simple API for developers to use when working with
different SQL and NoSQL database engines. Its main goal is to provide Go
developers with the right tools to focus on writing business logic with a
reasonable compromise between productivity, development speed, and computing
resources.

Using well-known database drivers, `upper/db` communicates with the most
popular database engines ([PostgreSQL](../adapter/postgresql),
[MySQL](../adapter/mysql), [CockroachDB](../adapter/cockroachdb), [Microsoft
SQL Server](../adapter/mssql), [SQLite](../adapter/sqlite),
[QL](../adapter/ql), and [MongoDB](../adapter/mongo)).

## Core components

### The `db` package

The `db` package provides an **agnostic Go API** focused on working with
collections of items. This API is modeled after basic set theory concepts that
apply to relational and document-based database engines.

This API provides you with enough tools for most of the tasks you perform with
a database, such as:

* Basic CRUD (Create, Read, Update, and Delete).
* Search and delimitation of result sets.
* Mapping between Go structs (or slices of structs) and query results.
* Limit-offset pagination (page numbers).
* Cursor-based pagination (previous and next).
* Transactions.

```go:main.go
package main

import (
  "fmt"
  "log"

  "github.com/upper/db/v4/adapter/postgresql"
)

var settings = postgresql.ConnectionURL{
  Database: "booktown",
  Host:     "demo.upper.io",
  User:     "demouser",
  Password: "demop4ss",
}

func main() {
  sess, err := postgresql.Open(settings)
  if err != nil {
    log.Fatal("postgresql.Open: ", err)
  }
  defer sess.Close()

  // The `db` API is portable, you can expect code to work the same on
  // different databases
  booksCounter, err := sess.Collection("books").Find().Count()
  if err != nil {
    log.Fatal("Find: ", err)
  }

  fmt.Printf("There are %d books in the database.\n", booksCounter)
}
```

### The SQL builder

Sometimes, an agnostic API won't be enough; for those tasks, `upper/db` also
provides a **SQL builder interface**, which provides more direct access to the
database with the additional advantage of using a SQL-like Go API or raw SQL
sentences.

```go:main.go
package main

import (
  "fmt"
  "log"

  "github.com/upper/db/v4/adapter/postgresql"
)

var settings = postgresql.ConnectionURL{
  Database: "booktown",
  Host:     "demo.upper.io",
  User:     "demouser",
  Password: "demop4ss",
}

func main() {
  sess, err := postgresql.Open(settings)
  if err != nil {
    log.Fatal("postgresql.Open: ", err)
  }
  defer sess.Close()

  // Define a query
  row, err := sess.SQL().QueryRow("SELECT COUNT(1) FROM books")
  if err != nil {
    log.Fatal("Find: ", err)
  }

  // Do what you'd normally do with `database/sql`
  var counter int
  if err = row.Scan(&counter); err != nil {
    log.Fatal("Scan: ", err)
  }

  fmt.Printf("We have %d books in our database.\n", counter)
}
```

### The (optional) ORM-like interface

`upper/db` provides an (optional) ORM-like layer that allows developers to
represent data structures and relationships between them in a more opinionated
way. This layer simplifies the process of working with complex data models and
relationships, providing a higher level of abstraction and reducing the amount
of boilerplate code required.

```go:main.go
package main

import (
  "fmt"
  "log"

  "github.com/upper/db/v4/adapter/postgresql"
  "github.com/upper/db/v4"
)

var settings = postgresql.ConnectionURL{
  Database: "booktown",
  Host:     "demo.upper.io",
  User:     "demouser",
  Password: "demop4ss",
}

// Book represents a record from the "books" table.
type Book struct {
  ID        uint   `db:"id,omitempty"`
  Title     string `db:"title"`
  AuthorID  uint   `db:"author_id,omitempty"`
  SubjectID uint   `db:"subject_id,omitempty"`
}

func (*Book) Store(sess db.Session) db.Store {
  return sess.Collection("books")
}

func main() {
  sess, err := postgresql.Open(settings)
  if err != nil {
    log.Fatal("postgresql.Open: ", err)
  }
  defer sess.Close()

  var book Book
  err = sess.Get(&book, db.Cond{"id": 7808})
  if err != nil {
    log.Fatal("Find: ", err)
  }

  fmt.Printf("Book: %#v", book)
}
```

## Getting started

* [Key concepts](/v4/getting-started/key-concepts)
* [Connect to a database](/v4/getting-started/connect-to-a-database)
* [Mapping database records to Go structs](/v4/getting-started/struct-mapping)
* [Using the agnostic db API](/v4/getting-started/agnostic-db-api)
* [Using the SQL builder API](/v4/getting-started/sql-builder-api)
* [Transactions](/v4/getting-started/transactions)
* [Logger](/v4/getting-started/logger)

## Tutorials

* [ORM-like behavior with `db.Record`, `db.Store`, and
  hooks](/v4/tutorial/record-store-and-hooks)

## Supported adapters

* [PostgreSQL](/v4/adapter/postgresql)
* [MySQL](/v4/adapter/mysql)
* [CockroachDB](/v4/adapter/cockroachdb)
* [Microsoft SQL Server](/v4/adapter/mssql)
* [SQLite](/v4/adapter/sqlite)
* [QL](/v4/adapter/ql)
* [MongoDB](/v4/adapter/mongo)
