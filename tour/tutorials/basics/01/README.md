# Connect to a database

## 1. Get a Database Adapter

To connect to a database, you need an adapter. Use `go get` to fetch it like
this:

```sh
go get github.com/upper/db/v4/adapter/{$ADAPTER}
```

Where `$ADAPTER` could be any of the following:

* `postgresql`: for [PostgreSQL](https://www.postgresql.org/)
* `mysql`: for [MySQL](https://www.mysql.com/)
* `sqlite`: for [SQLite](https://www.sqlite.org/index.html)
* `cockroachdb`: for [CockroachDB](https://www.cockroachlabs.com/product/)
* `mongo`: for [MongoDB](https://www.mongodb.com/)
* `ql`: for [QL](https://pkg.go.dev/modernc.org/ql)

For instance, if you’d like to use the PostgreSQL adapter, you’d first run:

```sh
go get -u github.com/upper/db/v4/adapter/postgresql
```

to get the adapter, and then you can import it into your
project:

```sh
import (
  "github.com/upper/db/v4/adapter/postgresql"
)
```

## 2. Configure a Database Connection

Set the database credentials using the `ConnectionURL` type provided by the
adapter:

```go
import (
  "github.com/upper/v4/adapter/postgresql"
)

var settings = postgresql.ConnectionURL{
  Database: `booktown`,
  Host:     `postgres`,
  User:     `demo`,
  Password: `b4dp4ss`,
}
```

Note that the `ConnectionURL` (which satisfies the [db.ConnectionURL][1]
interface) varies from database engine to another. The connection properties
required by each adapter are explained in detail [here][2].

## 3. Establish a Connection

Use the `Open` function to establish a connection with the database server:

```go
sess, err := postgresql.Open(settings)
...
```

## 4. Close the Connection

Set the database connection to close automatically after completing all tasks.
Use `Close` and `defer`:

```go
defer sess.Close()
```

[1]: https://pkg.go.dev/github.com/upper/db/v4#ConnectionURL
[2]: https://upper.io/v4/adapter/
