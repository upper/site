---
title: MongoDB
---

The `mongo` adapter for [MongoDB][3] wraps the `labix.org/v2/mgo` driver
written by [Gustavo Niemeyer][1].

Please note that MongoDB:

* Does not support transactions.
* Does not support query builder.
* Uses [bson][4] tags instead of `db` for mapping.

## Installation

To use the package, you'll need the [bazaar][2] version control system:

```
sudo apt-get install bzr -y
```

Once this requirement is met, use `go get` to download and install the adapter:

```
go get github.com/upper/db/v4/adapter/mongo
```

## Setup

Import the `github.com/upper/db/v4/adapter/mongo` package into your
application:

```go
// main.go
package main

import (
  "github.com/upper/db/v4/adapter/mongo"
)
```

Define the `mongo.ConnectionURL{}` struct:

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

Pass the `mongo.ConnectionURL` value as argument to `mongo.Open()` so the
`mongo.Database` session is created.

```go
settings = mongo.ConnectionURL{
  ...
}

sess, err = mongo.Open(settings)
...
```

> The `mongo.ParseURL()` function is also provided in case you need to convert
> a DSN into a `mongo.ConnectionURL`:

```go
// ParseURL parses s into a ConnectionURL struct.
mongo.ParseURL(s string) (ConnectionURL, error)
```

Once the connection is established, you can start performing operations on the
database.

### Example

In the following example, a table named 'birthday' consisting of two columns
('name' and 'born') will be created. Before starting, the table will be
searched in the database and, in the event it already exists, it will be
removed. Then, three rows will be inserted into the table and checked for
accuracy. To this end, the database will be queried and the matches
(insertions) will be printed to standard output.

The rows are inserted into the `birthday` table. The database is queried for
the insertions and is set to print them to standard output.

```go
// example.go

package main

import (
  "fmt"
  "log"
  "time"

  "github.com/upper/db/v4/adapter/mongo"
)

var settings = mongo.ConnectionURL{
  Database:  `upperio_tests`,  // Database name
  Host:      `127.0.0.1`,      // Server IP or name
}

type Birthday struct {
  // The 'name' column of the 'birthday' table
  // is mapped to the 'name' property.
  Name string `bson:"name"`
  // The 'born' column of the 'birthday' table
  // is mapped to the 'born' property.
  Born time.Time `bson:"born"`
}

func main() {

  // The database connection is attempted.
  sess, err := mongo.Open(settings)
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
  var birthday []Birthday

  err = res.All(&birthday)
  if err != nil {
    log.Fatalf("res.All(): %q\n", err)
  }

  // The 'birthdays' variable is printed to stdout.
  for _, birthday := range birthday {
    fmt.Printf(
      "%s was born in %s.\n",
      birthday.Name,
      birthday.Born.Format("January 2, 2006"),
    )
  }
}
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

## Take the tour

Get the real `upper/db` experience, take the [tour](/tour).

[1]: http://labix.org/v2/mgo
[2]: http://bazaar.canonical.com/en/
[3]: http://www.mongodb.org/
[4]: http://labix.org/gobson
