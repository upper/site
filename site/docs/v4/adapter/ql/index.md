---
title: QL
---

The `ql` adapter for [QL][1] wraps the `github.com/cznic/ql/ql` driver
written by [Jan Mercl][1].

> Before starting to read this detailed information, it is advisable that you
> take a look at the [getting started](/v4/getting-started) page so you become
> acquainted with the basics of `upper/db`, and you can grasp concepts better.

## Installation

Use `go get` to download and install the adapter:

```go
go get github.com/upper/db/adapter/ql
```

## Setup

Import the `ql` package into your application:

```go
// main.go
package main

import (
  "github.com/upper/db/adapter/ql"
)
```

Define the `ql.ConnectionURL{}` struct:

```go
// ConnectionURL defines the DSN attributes.
type ConnectionURL struct {
  Database string
  Options  map[string]string
}
```

Pass the `ql.ConnectionURL` value as argument to `ql.Open()` so the session is
created.

```go
settings = ql.ConnectionURL{
  ...
}

sess, err = ql.Open(settings)
...
```

> Use the `ql.ParseURL()` function to convert a DSN into a `ql.ConnectionURL`:

```go
// ParseURL parses a DSN into a ConnectionURL struct.
ql.ParseURL(dsn string) (ConnectionURL, error)
```

Once the connection is established, you can start performing operations on the
database.

### Example

In the following example, a table named ‘birthday’ consisting of two columns
(‘name’ and ‘born’) will be created. Before starting, the table will be
searched in the database and, in the event it already exists, it will be
removed. Then, three rows will be inserted into the table and checked for
accuracy. To this end, the database will be queried and the matches
(insertions) will be printed to standard output.

The `birthday` table with the `name` and `born` columns is created with these
SQL statements:

```sql
--' example.sql
DROP TABLE IF EXISTS birthday;

CREATE TABLE birthday (
  name string,
  born time
);
```

The `ql` command line tool is used to create an `example.db` database file:

```
rm -f example.db
cat example.sql | ql -db example.db
```

The rows are inserted into the `birthday` table. The database is queried for
the insertions and is set to print them to standard output.

```go
// example.go

package main

import (
  "fmt"
  "log"
  "time"

  "github.com/upper/db/adapter/ql"
)

var settings = ql.ConnectionURL{
  Database: `example.db`, // Path to database file
}

type Birthday struct {
  // The 'name' column of the 'birthday' table
  // is mapped to the 'name' property.
  Name string `db:"name"`
  // The 'born' column of the 'birthday' table
  // is mapped to the 'born' property.
  Born time.Time `db:"born"`
}

func main() {

  // Attempt to open the 'example.db' database file
  sess, err := ql.Open(settings)
  if err != nil {
    log.Fatalf("db.Open(): %q\n", err)
  }
  defer sess.Close() // Closing the session is a good practice.

  // The 'birthday' table is referenced.
  birthdayCollection := sess.Collection("birthday")

  // Any rows that might have been added between the creation of
  // the table and the execution of this function are removed.
  err = birthdayCollection.Truncate()
  if err != nil {
    log.Fatalf("Truncate(): %q\n", err)
  }

  // Three rows are inserted into the 'Birthday' table.
  birthdayCollection.Insert(Birthday{
    Name: "Hayao Miyazaki",
    Born: time.Date(1941, time.January, 5, 0, 0, 0, 0, time.Local),
  })

  birthdayCollection.Insert(Birthday{
    Name: "Nobuo Uematsu",
    Born: time.Date(1959, time.March, 21, 0, 0, 0, 0, time.Local),
  })

  birthdayCollection.Insert(Birthday{
    Name: "Hironobu Sakaguchi",
    Born: time.Date(1962, time.November, 25, 0, 0, 0, 0, time.Local),
  })

  // The database is queried for the rows inserted.
  res := birthdayCollection.Find()

  // The 'birthdays' variable is filled with the results found.
  var birthdays []Birthday

  err = res.All(&birthdays)
  if err != nil {
    log.Fatalf("res.All(): %q\n", err)
  }

  // The 'birthdays' variable is printed to stdout.
  for _, birthday := range birthday {
    fmt.Printf("%s was born in %s.\n",
      birthday.Name,
      birthday.Born.Format("January 2, 2006"),
    )
  }
}

```

Compile the example and run it:

```
go run example.go
```

The output will be:

```
Hayao Miyazaki was born in January 5, 1941.
Nobuo Uematsu was born in March 21, 1959.
Hironobu Sakaguchi was born in November 25, 1962.
```

## Adapter particularities

### SQL Builder

You can use the SQL builder for any complex SQL query:

```go
q := b.SQL().Select(
    "p.id",
    "p.title AD publication_title",
    "a.name AS artist_name",
  ).From("artists AS a", "publication AS p").
  Where("a.id = p.author_id")

var publications []Publication
if err = q.All(&publications); err != nil {
  log.Fatal(err)
}
```

### Helper functions

Use `db.Func` to escape function names and arguments:

```go
res = sess.Find().Select(db.Func("DISTINCT", "name"))
```

Use the `db.Raw()` function for strings that have to be interpreted literally:

```go
res = sess.Find().Select(db.Raw("DISTINCT(name)"))
```

> `db.Raw` can also be used as a condition argument, similarly to `db.Cond`.

## Take the tour

Get the real `upper/db` experience, take the [tour](/tour).

[1]: https://github.com/cznic/ql
[2]: http://golang.org/doc/effective_go.html#blank
