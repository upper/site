# Query database records

The `Collection` method takes the name of a table in the database and returns a
value that satisfies the [db.Collection][1] interface:

```go
booksTable := sess.Collection("books")
```

One of the methods defined by the `db.Collection` interface is `Find`.

Use `Find` to search for specific records within the collection hierarchy.
`Find` returns a [db.Result][2] object, which is delimited by the condition
passed to `Find` and can contain zero, one, or many database records.

The `db.Result` interface works the same on all supported databases.

The following query fetches and maps all the records from the "books" table:

```go
var books []Book

res := booksTable.Find()
err := res.All(&books)
```

You can build the query to return records in different ways, such as sorted by
title (descending order):

```go
var books []Book

res := booksTable.Find().OrderBy("-title")
err := res.All(&books)
```

Use `One` instead of `All` if you want to retrieve a single record from the
set:

```go
var book Book

res := booksTable.Find(db.Cond{"id": 4})
err := res.One(&book)
```

You can also determine the total number of records in the result set with
`Count`:

```go
res := booksTable.Find()

total, err := res.Count()
...
```

Depending on your database type, you have many [options for defining
queries][3].

## Query builder and raw SQL

In the particular case of adapters for SQL databases, you can also choose to
use a query builder (for more control over your query):

```go
q := sess.SQL().Select().From("books")

var books []Book
err := q.All(&books)
```

... or raw SQL (for absolute control over your query):

```
rows, err := sess.SQL().Query("SELECT * FROM books")
// rows is a regular *sql.Rows object.
```

[1]: https://pkg.go.dev/github.com/upper/db/v4#Collection
[2]: https://pkg.go.dev/github.com/upper/db/v4#Result
[3]: https://upper.io/v4/getting-started/agnostic-db-api
