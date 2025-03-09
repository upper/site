---
title: Microsoft SQL Server
---

The `mssql` adapter for [SQL Server][2] wraps the
`github.com/denisenkom/go-mssqldb` driver written by [denisenkom][1].

> Before starting to read this detailed information, it is advisable that you
> take a look at the [getting started](/v4/getting-started) page so you become
> acquainted with the basics of `upper/db`, and you can grasp concepts better.

## Installation

Use `go get` to download and install the adapter:

```
go get github.com/upper/db/v4/adapter/mssql
```

## Setup

Import the `mssql` package into your application:

```go
package main

import (
	"github.com/upper/db/v4/adapter/mssql"
)
```

Define the `mssql.ConnectionURL{}` struct:

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

Pass the `mssql.ConnectionURL` value as argument to `mssql.Open()` so the
session is created.

```go
settings = mssql.ConnectionURL{
  ...
}

sess, err = mssql.Open(settings)
...
```

> Use the `mssql.ParseURL()` function to convert a DSN into a
> `mssql.ConnectionURL`:

```go
// ParseURL parses a DSN into a ConnectionURL struct.
mssql.ParseURL(dsn string) (ConnectionURL, error)
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
CREATE TABLE [birthdays] (
  id BIGINT PRIMARY KEY NOT NULL IDENTITY(1,1),
  name NVARCHAR(50),
  born DATETIME,
  born_ut BIGINT
);
```

The `sqlcmd` command line tool is used to run the statements in the
`upperio_tests` database:

```
sqlcmd -U upperio -P upperio -i example.sql
```

The rows are inserted into the `birthday` table. The database is queried for
the insertions and is set to print them to standard output.

```go
<standard input>:13:51: missing ',' before newline in composite literal
```

Compile and run the example:

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

### JSON Types

You can save and retrieve data when using [JSON
types](https://docs.microsoft.com/en-us/sql/relational-databases/json/json-data-sql-server?view=sql-server-2017).
If you want to try this out, make sure the column type is `json` and the field
type is `mssql.JSON`:

```
import (
  ...
  "github.com/upper/db/v4/adapter/mssql"
  ...
)

type Person struct {
  ...
  Properties  mssql.JSON  `db:"properties"`
  Meta        mssql.JSON  `db:"meta"`
}
```

> JSON types area supported on SQL Server 2016+.

### SQL Builder

You can use the SQL builder for any complex SQL query:

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

### Identity Columns

If you want tables to generate a unique number automatically whenever a new
record is inserted, you can use auto-incremental keys. In this case, the column
must be defined as `IDENTITY(1, 1)`.

> In order for the ID to be returned by `db.Collection.Insert()`, the
> `IDENTITY` column must be set as `PRIMARY KEY` too.

```sql
CREATE TABLE foo(
  id BIGINT PRIMARY KEY NOT NULL IDENTITY(1,1),
  title NVARCHAR(50)
);
```

Remember to use `omitempty` to specify that the ID field should be ignored if
it has an empty value:

```go
type Foo struct {
  ID    int64   `db:"id,omitempty"`
  Title string  `db:"title"`
}
```

Otherwise, an error will be returned.

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

[1]: https://github.com/denisenkom
[2]: https://www.microsoft.com/en-us/sql-server/sql-server-2016
