## a) SQL Builder: Update, Insert and Delete

The `Update` method creates and returns an [Updater][1] that you can use to
build an UPDATE statement:

```go
q := sess.SQL().
  Update("authors").
  Set("first_name = ?", "Edgar Allan").
  Where("id = ?", eaPoe.ID)

res, err := q.Exec()
```

The `InsertInto` method creates and returns an [Inserter][2] that you can use
to build an INSERT statement:

```go
res, err = sess.SQL().
  InsertInto("books").
  Columns(
    "title",
    "author_id",
    "subject_id",
  ).
  Values(
    "Brave New World",
    45,
    11,
  ).
  Exec()
```

In this case, using `Columns` is not mandatory. You can pass a struct to the
`Values` method so it is mapped to columns and values, as shown below:

```go
book := Book{
  Title:    "The Crow",
  AuthorID: eaPoe.ID,
}

res, err = sess.SQL().
  InsertInto("books").
  Values(book).
  Exec()
```

The `DeleteFrom` method creates and returns a [Deleter][3] that you can use to
build a DELETE query:

```go
q := sess.SQL().
  DeleteFrom("books").
  Where("title", "The Crow")

res, err := q.Exec()
```

## b) Raw SQL

If none of the previous methods described are enough to express your query, you
can use raw SQL. Look at the [db.SQL][4] interface to learn about all available
methods for building and executing raw SQL statements.

```go
res, err := sess.SQL().Exec(`UPDATE authors SET first_name = ? WHERE id = ?`, "Edgar
Allan", eaPoe.ID)
...

res, err := sess.SQL().Exec(`INSERT INTO authors VALUES`)
...

res, err := sess.SQL().Exec(`DELETE authors WHERE id = ?`, "Edgar Allan", eaPoe.ID)
```

[1]: https://pkg.go.dev/github.com/upper/db/v4#Updater
[2]: https://pkg.go.dev/github.com/upper/db/v4#Inserter
[3]: https://pkg.go.dev/github.com/upper/db/v4#Deleter
[4]: https://pkg.go.dev/github.com/upper/db/v4#SQL
