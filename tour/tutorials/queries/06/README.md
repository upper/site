# Update, insert, or delete records in a result set

The records in result sets can not only be queried but also modified and
removed.

If you want to modify the properties of a whole result set, use `Update`:

```go
var book Book
res := booksCol.Find(4267)

err = res.One(&book)
...

book.Title = "New title"

err = res.Update(book)
...
```

Note that the result above set consists of only one element, whereas the next
result set consists of all the records in the collection:

```go
res := booksCol.Find()

// Updating all records in the result set.
err := res.Update(map[string]int{
  "author_id": 23,
})
```

If you want to remove all the records in a result set, use `Delete`:

```go
res := booksCol.Find(4267)

err := res.Delete()
// ...
```

As with the `Update` examples, in the previous case, only one record will be
affected, and in the following scenario, all records will be deleted:

```go
res := booksCol.Find()

//  Deleting all records in the result-set.
err := res.Delete()
...
```

Given that the examples in this tour are based on an SQL database, we'll
elaborate on the use of both a) SQL builder methods and b) raw SQL statements.