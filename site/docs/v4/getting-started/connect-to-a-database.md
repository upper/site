---
title: Connecting to a database
---

Use `go get` to import the database adapter:

```
go get -v -u github.com/upper/db/v4/adapter/$ADAPTER_NAME
```

Import the adapter package into your application:

```go
import (
  "github.com/upper/db/v4/adapter/{{adapter_name}}"
)
```

The `{{adapter_name}}` could be any of the following supported adapters:
`postgresql`, `mysql`, `cockroachdb`, `mssql`, `sqlite`, `ql` or `mongo`.

In this example we'll use the PostgreSQL adapter:

```go
import (
  "github.com/upper/db/v4/adapter/postgresql"
)
```

All adapters come with a `ConnectionURL` struct that you can use to describe
parameters to open a database:

```go
import (
  "github.com/upper/db/v4/adapter/postgresql"
)

// Use the `ConnectionURL` struct to create a DSN:
var settings = postgresql.ConnectionURL{
  User:     "maria",
  Password: "p4ss",
  Address:  "10.0.0.99",
  Database: "myprojectdb",
}

fmt.Printf("DSN: %s", settings)
```

Every adapter comes with an `Open()` function that takes a `ConnectionURL` and
attempts to create a database session:

```go
// sess is a db.Session type
sess, err := postgresql.Open(settings)
...
```

Instead of `postgresql.ConnectionURL` you can use `mysql.ConnectionURL`,
`mssql.ConnectionURL`, etc. All of these structs satisfy `db.ConnectionURL`.

It is also possible to use a DSN string like
`[adapter]://[user]:[password]@[host]/[database]`; you can easily convert it
into a `ConnectionURL` struct and use it to connect to a database by using the
`ParseURL` function that comes with your adapter:

```go
import (
  ...
  "github.com/upper/db/v4/adapter/postgresql"
  ...
)

const connectDSN = `postgres://demouser:demop4ss@demo.upper.io/booktown`

// Convert the DSN into a ConnectionURL
settings, err := postgresql.ParseURL(connectDSN)
...

// And use it to connect to your database.
sess, err := postgresql.Open(settings)
...

log.Println("Now you're connected to the database!")
```

Once you finish working with the database session, use `Close()` to free all
associated resources and caches. Keep in mind that Go apps are long-lived
processes, so you may only need to manually close a session if you don't need
it at all anymore.

```
// Closing session
err = sess.Close()
...
```

The following example demonstrates how to connect, ping and disconnect from a
PostgreSQL database.

```go:embed
package main

import (
	"fmt"
	"github.com/upper/db/v4/adapter/postgresql"
	"log"
)

var settings = postgresql.ConnectionURL{Database: "booktown", Host: "demo.upper.io", User: "demouser", Password: "demop4ss"}

func main() {
	sess, err := postgresql.Open(settings)
	if err != nil {
		log.Fatal("Open: ", err)
	}
	defer sess.Close()
	if err := sess.Ping(); err != nil {
		log.Fatal("Ping: ", err)
	}

	fmt.Printf("Successfully connected to database: %q", sess.Name())
}
```

Please note that different databases may have particular ways of connecting to a database server or opening a database file; some databases, like SQLite, use plain files for storage instead of a central server. Please refer to the page of the adapter you're using to see such particularities.

Underlying Driver

If you require methods only available from the underlying driver, you can use the `Driver()` method, which returns an `interface{}`. For instance, if you need the mgo.Session.Ping method, you can retrieve the underlying `*mgo.Session` as an `interface{}`, cast it into the appropriate type, and use `Ping()`, as shown below:

```go
drv = sess.Driver().(*mgo.Session) // The driver is cast into the
                                   // the appropriate type.
err = drv.Ping()
```

You can do the same when working with an SQL adapter by changing the casting:

```go
drv = sess.Driver().(*sql.DB)
rows, err = drv.Query("SELECT name FROM users WHERE age = ?", age)
```
