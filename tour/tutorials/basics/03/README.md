# Get a collection by name

Use the `Collection` method on a [`db.Session`][1] to get a reference to a
specific collection:

```go
col := sess.Collection("books")
```

A collection reference satisfies [`db.Collection`][2] and gives you access to a
set of methods for retrieving and manipulating data, such as `Find` (to search
for specific records in the collection) and `Insert` (to add more records to a
collection).

Note that if you create a reference to a collection that doesn’t exist, you’ll
see a warning message:

```
2020/07/01 00:11:33 upper/db: log_level=WARNING file=/go/src/git...
 Session ID:     00001
 Query:          SELECT "pg_attribute"."attname" AS "pkey" ...
 Error:          pq: relation "fake_collection" does not exist
 Time taken:     0.00129s
 Context:        context.Background
```

If you’d prefer not to see warning messages, set a higher logging level:

```go
db.LC().SetLevel(db.LogLevelError)
```

Use the `Exists` method to check whether a collection exists or not:

```go
exists, err := collection.Exists()
if errors.Is(err, db.ErrCollectionDoesNotExist) {
 log.Printf("Collection does not exist: %v", err)
}
```

[1]: https://pkg.go.dev/github.com/upper/db/v4#Session
[2]: https://pkg.go.dev/github.com/upper/db/v4#Collection
