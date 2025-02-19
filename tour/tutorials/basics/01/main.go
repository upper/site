package main

import (
	"fmt"
	"log"

	// Import an adapter
	"github.com/upper/db/v4/adapter/postgresql"
)

// Set the database credentials using the ConnectionURL type provided by the
// adapter.
var settings = postgresql.ConnectionURL{
	Database: `booktown`,
	Host:     `postgresql.demo.upper.io`,
	User:     `demouser`,
	Password: `demop4ss`,
}

func main() {
	// Use Open to access the database.
	sess, err := postgresql.Open(settings)
	if err != nil {
		log.Fatal("Open: ", err)
	}
	defer sess.Close()

	// The settings variable has a String method that builds and returns a valid
	// DSN. This DSN may be different depending on the database you're connecting
	// to.
	fmt.Printf("Connected to %q with DSN:\n\t%q", sess.Name(), settings)
}
