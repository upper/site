---
title: SQL builder API
---

The SQL builder API provides tools to represent SQL expressions with Go code,
which gives you some additional advantages over regular string queries:

 * You can benefit from the Go compiler syntax check.
 * It is easier to compose and reuse queries.

Using the agnostic data API or the SQL API depends on the specific needs of
your application.

The SQL builder methods are available on all SQL adapters:

```go
sess, err := postgresql.Open(settings)
...

sqlbuilder := sess.SQL()
```

## Select statements

Use the `Select()` method on a session to begin a `SELECT` statement
(a db.Selector).

```go
q = sess.SQL().
  Select("id", "name")
```

If you compiled the select statement, it would look like `SELECT "id",
"name";` which is an incomplete SQL query; you still need to specify which
table to select from: chain the `From()` method to do that:

```go
q = sess.SQL().
  Select("id", "name").From("accounts")
```

Now you have a complete query that you can compile into a full SQL statement:

```go
var accounts []Account
q = sess.SQL().
  Select("id", "name").From("accounts")

fmt.Println(q) // SELECT id, name FROM accounts
```

That query is wired to the database session, but it's not compiled nor executed
unless you require data from it. Use the `All()` method on a query to execute
it and map all the resulting rows into a slice of structs or maps:

```go
var accounts []Account
...

// All() executes the query and maps the resulting rows into an slice of
// structs or maps.
err = q.All(&accounts)
...
```

If you're only interested in one result, use `One()` instead of `All()`, and
provide a single pointer to struct or map:

```go
var account Account
...

err = q.One(&account)
...
```

To select all the columns instead of specific ones, you can use
the `SelectFrom()` method:

```go
// SELECT * FROM accounts
q = sess.SQL().
  SelectFrom("accounts")
...

err = q.All(&accounts)
...

// Which is basically equivalent to:
q = sess.SQL().
  Select().From("accounts")
```

Using `All()` could be expensive for large databas; it's probably more
efficient to get results one by one using an iterator:

```
var account Account

iter := q.Iterator()
for iter.Next(&account) {
  log.Printf("account: %v", account)
  ...
}

// Remember to check for iterator errors
if err = iter.Err(); err != nil {
  ...
}
```

Iterators are automatically closed at the end of the `Next()`-based loop. If
you need to exit the iterator before the loop is completed use `iter.Close()`:

```go
for iter.Next() {
  if somethingHappened() {
    iter.Close()
    break
  }
}
```

Depending on your specific needs, you have to decide whether you want to
use `All()`, `One()` or an iterator .

### SELECT statements and joins

The `Join()` method is part of a `Selector`, you can use it to represent SELECT
statements that use JOINs.

```go
q = sess.SQL().
  Select("a.name").From("accounts AS a").
  Join("profiles AS p").
  On("p.account_id = a.id")
...

q = sess.SQL().
  Select("name").From("accounts").
  Join("owners").
  Using("employee_id")
...
```

In addition to `Join()` you can also
use `FullJoin()`, `CrossJoin()`, `RightJoin()` and `LeftJoin()`.

### INSERT statement

The `InsertInto()` method begins an INSERT statement

```go
q = sess.SQL().
  InsertInto("people").
  Columns("name").
  Values("John")

res, err = q.Exec()
...
```

You don't have to use the `Columns()` method, if you pass a map or a struct,
you can omit it completely:

```go
account := Account{
  ...
}

q = sess.SQL().
  InsertInto("people").Values(account)

res, err = q.Exec() // res is a sql.Result
...
```

## UPDATE statement

The `Update()` method takes a table name and begins an UPDATE statement
(an db.Updater ):

```go
q = sess.SQL().
  Update("people").
  Set("name", "John").
  Where("id = ?", 5)

res, err = q.Exec()
...
```

You can update many columns at once by providing column-value pairs to `Set()`:

```go
q = sess.SQL().
  Update("people").
  Set(
    "name", "John",
    "last_name", "Smith",
  ).Where("id = ?", 5)

res, err = q.Exec()
...
```

You don't always have to provide column-value pairs, `Set()` also accepts maps
or structs:

```go
q = sess.SQL().
  Update("people").
  Set(map[string]interface{}{
    "name": "John",
    "last_name": "Smith",
  }).Where("id = ?", 5)

res, err = q.Exec()
...
```

### DELETE statement

You can begin a `DELETE` statement with the `DeleteFrom()` method:

```go
q = sess.SQL().
  DeleteFrom("accounts").Where("id", 5)

res, err = q.Exec()
...
```

### WHERE clause

Use `Where()` to define conditions on
a `Selector`, Deleter` or `Updater` interfaces.

For instance, let's suppose we have a `Selector`:

```go
q = sess.SQL().
  SelectFrom("accounts")
```

We can use the `Where()` method to add conditions to the above query.

How about constraining the results only to rows that match `id = 5?`:

```go
q = q.Where("id = ?", 5)
```

We use a `?` as a placeholder for the argument, which is required to sanitize
arguments and prevent SQL injections. You can use as many arguments as you need
as long as you provide a value for each one of them:

```go
q = q.Where("id = ? OR id = ?", 5, 4) // Two place holders and two values.
```

The above condition is a list of ORs, and sometimes we can rewrite such
conditions into this:

```go
q = q.Where("id IN ?", []int{5,4}) // id IN (5, 4)
```

Placeholders are not always necessary; if you're looking for an equality and
you're only going to provide one argument, you can drop the `?` at the end:

```go
q = q.Where("id", 5)
...

q = q.Where("id IN", []int{5,4})
...
```

It is also possible to use other operators besides the equality, but you have
to be explicit about them:

```go
q = q.Where("id >", 5)
...

q = q.Where("id > ? AND id < ?", 5, 10)
...
```

You can also use `Cond` to define conditions for `Where()` just like you would
normally do when using `Find()`:

```go
// ...WHERE "id" > 5
q = q.Where(db.Cond{
  "id >": 5,
})
...

// ...WHERE "id" > 5 AND "id" < 10
q = q.Where(db.Cond{"id >": 5, "id <": 10})
...

// ...WHERE ("id" = 5 OR "id" = 9 OR "id" = 12)
q = q.Where(db.Or(
  db.Cond{"id": 5},
  db.Cond{"id": 9},
  db.Cond{"id": 12},
))
```

## Plain SQL statements

If the builder does not provide you with enough flexibility to create complex
SQL queries, you can always use plain SQL:

```go
rows, err = sess.SQL().
  Query(`SELECT * FROM accounts WHERE id = ?`, 5)
...

row, err = sess.SQL().
  QueryRow(`SELECT * FROM accounts WHERE id = ? LIMIT ?`, 5, 1)
...

res, err = sess.SQL().
  Exec(`DELETE FROM accounts WHERE id = ?`, 5)
...
```

The `Query()` method returns a `*sql.Rows` object and of course, you can do
whatever you would normally do with it:

```go
err = rows.Scan(&id, &name)
...
```

If you don't want to use `Scan()` directly, you could create an iterator using
any `*sql.Rows` value:


```go
rows, err = sess.SQL().
  Query(`SELECT * FROM accounts WHERE last_name = ?`, "Smith")
...

var accounts []Account
iter := sess.SQL().NewIterator(rows)
err = iter.All(&accounts)
...
```
