---
title: PostgreSQL
---

The `postgresql` adapter for PostgreSQL wraps the `github.com/lib/pq` driver
written by Blake Mizerany.

> Before starting to read this detailed information, it is advisable that you
> take a look at the [getting started](/v4/getting-started) page so you become
> acquainted with the basics of `upper/db`, and you can grasp concepts better.

## Installation

Use `go get` to download and install the adapter:

```
go get github.com/upper/db/v4/adapter/postgresql
```

## Setup

Import the `postgresql` package into your application:

```go
// main.go
package main

import (
  "github.com/upper/db/v4/adapter/postgresql"
)
```

Define the `postgresql.ConnectionURL` struct:

```go
// ConnectionURL defines the DSN attributes.
type ConnectionURL struct {
  User     string
  Password string
  Host     string
  Database string
  Options  map[string]string
}
```

Pass the `postgresql.ConnectionURL` value as argument to `postgresql.Open()` to
establish a connection to the server, and create a database session:

```go
settings = postgresql.ConnectionURL{
  ...
}

sess, err = postgresql.Open(settings)
...
```

> Use the `postgresql.ParseURL()` function to convert a DSN into
> a `postgresql.ConnectionURL`:

```go
// ParseURL parses a DSN into a ConnectionURL struct.
postgresql.ParseURL(dsn string) (ConnectionURL, error)
```

Once the connection is established, you can start performing operations on the
database.

## Example

In the following example, a table named 'birthday' consisting of two columns
('name' and 'born') will be created. Before starting, the table will be
searched in the database and, in the event it already exists, it will be
removed. Then, three rows will be inserted into the table and checked for
accuracy. To this end, the database will be queried and the matches
(insertions) will be printed to standard output.

The `birthday` table with the `name` and `born` columns is created with these
SQL statements:

```sql
--' example.sql
DROP TABLE IF EXISTS "birthday";

CREATE TABLE "birthday" (
  "name" CHARACTER VARYING(50),
  "born" TIMESTAMP
);
```

The `psql` command line tool is used to run the statements in
the `upperio_tests` database:

```sql
cat example.sql | PGPASSWORD=upperio psql -Uupperio upperio_tests
```

The rows are inserted into the birthday table. The database is queried for the
insertions and is set to print them to standard output.

```go
package main

import (
	"fmt"
	"log"
	"time"

	"github.com/upper/db/v4/adapter/postgresql"
)

var settings = postgresql.ConnectionURL{
	Database: `upperio_tests`, // Database name
	Host:     `localhost`,     // Server IP or name
	User:     `upperio`,       // Username
	Password: `upperio`,       // Password
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

	// The database connection is attempted.
	sess, err := postgresql.Open(settings)
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
	for _, birthday := range birthdays {
		fmt.Printf("%s was born in %s.\n",
			birthday.Name,
			birthday.Born.Format("January 2, 2006"),
		)
	}
}
```

Compile the example and run it:

```go
go run example.go
```

The output will be:

```
Hayao Miyazaki was born in January 5, 1941.
Nobuo Uematsu was born in March 21, 1959.
Hironobu Sakaguchi was born in November 25, 1962.
```

## Adapter particularities

### JSON Types

You can save and retrieve data when using JSON types. If you want to try this
out, make sure the column type is JSONB and the field type
is `postgresql.JSONB`:

```go
package main

import (
  // ...
  "github.com/upper/db/v4/adapter/postgresql"
  // ...
)

type Person struct {
  ...
  Properties  postgresql.JSONB  `db:"properties"`
  Meta        postgresql.JSONB  `db:"meta"`
}
```

JSON types are supported on PostgreSQL 9.4+. In addition to these, the adapter
features other custom types
like `postgresql.StringArray` and `postgresql.Int64Array`.

### SQL builder

Use the SQL builder for any complex SQL query:

```go
q := sess.SQL().Select(
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

### Auto-incremental Keys (Serial)

If you want tables to generate a unique number automatically whenever a new
record is inserted, you can use auto-incremental keys. In this case, the column
must be defined as SERIAL.

For the ID to be returned by `db.Collection.Insert()`, the SERIAL column must
be set as PRIMARY KEY too.

```sql
CREATE TABLE foo(
  id SERIAL PRIMARY KEY,
  title VARCHAR
);
```

Remember to use `omitempty` to specify that the ID field should be ignored if
it has a zero value:

```go
type Foo struct {
  ID    int64   `db:"id,omitempty"`
  Title string  `db:"title"`
}
```

otherwise, an error will be returned.

### Helper functions

Use `db.Func` to escape function names and arguments:

```go
res = sess.Find().Select(db.Func("DISTINCT", "name"))
```

Use the `db.Raw()` function for strings that have to be interpreted literally:

```go
res = sess.Find().Select(db.Raw("DISTINCT(name)"))
```

> `db.Raw` can also be used as a condition argument, similarly to db.Cond.

## Take the tour

Get the real `upper/db` experience, take the [tour](/tour).

[1]: https://github.com/lib/pq
