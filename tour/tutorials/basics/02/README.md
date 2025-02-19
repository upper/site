# List all Collections (Tables) in a Database

Use the `Collections` method on a `db.Session` to get all the collections, or
tables, in the database:

```go
collections, err := sess.Collections()
...

for i := range collections {
  log.Printf("-> %s", collections[i].Name())
}
```

The `db.Session` interface provides methods that work on both SQL and NoSQL
databases. In light of this, sets of records, or rows, in a database are
referred to as 'collections', and no particular distinction is made between SQL
_tables_ and NoSQL _collections_.
