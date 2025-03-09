# Debug queries

These are the logging levels `upper/db` comes with, ranging from the lowest
severity (trace) to the highest (panic).

* `db.LogLevelTrace`
* `db.LogLevelDebug`
* `db.LogLevelInfo`
* `db.LogLevelWarn`
* `db.LogLevelError`
* `db.LogLevelFatal`
* `db.LogLevelPanic`

By default, `upper/db` is set to `db.LogLevelWarn`. Use `db.LC()` to set a
different logging level:

```go
db.LC().SetLevel(db.LogLevelDebug)
```

Set an appropriate logging level in production, as using levels lower than
`db.LogLevelWarn` could make things pretty slow and verbose.

```go
db.LC().SetLevel(db.LogLevelError)
```

# Handle Errors

Error scenarios may or may not be fatal depending on the nature of your
application, so make sure you're handling them properly:

```go
err = booksTable.Find(1).One(&book)
if err != nil {
  if errors.Is(err, db.ErrNoMoreRows) {
    // No rows found, which is okay.
    return nil
  }
  return err
}
```
