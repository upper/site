## b) Raw SQL

The raw SQL API provides all the power you need for custom queries, along with
object mapping, and other useful features of `upper/db`.

```go
rows, err := sess.SQL().Query(`
  SELECT id, first_name, last_name FROM authors WHERE last_name = ?
`, "Poe")
...

row, err := sess.SQL().QueryRow(`SELECT * FROM authors WHERE id = ?`, 23)
...
```

Use the `NewIterator` method to make mapping easier:

```go
iter := sess.SQL().NewIterator(rows)

var books []Book
err := iter.All(&books)
```

This iterator provides well-known `upper/db` methods like `One`, `All`, and
`Next`.

[1]: https://pkg.go.dev/github.com/upper/db/v4#SQL
