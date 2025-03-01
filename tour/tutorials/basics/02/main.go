package main

import (
	"fmt"
	"log"

	"github.com/upper/db/v4/adapter/postgresql"
)

var settings = postgresql.ConnectionURL{
	Database: "booktown",
	Host:     "postgres",
	User:     "demo",
	Password: "b4dp4ss",
	Options: map[string]string{
		"sslmode": "disable", // Disable TLS
	},
}

func main() {
	sess, err := postgresql.Open(settings)
	if err != nil {
		log.Fatal("Open: ", err)
	}
	defer sess.Close()

	fmt.Printf("Collections in database %q:\n", sess.Name())

	// The Collections method returns references to all the collections in the
	// database.
	collections, err := sess.Collections()
	if err != nil {
		log.Fatal("Collections: ", err)
	}

	for i := range collections {
		// Name returns the name of the collection.
		fmt.Printf("-> %q\n", collections[i].Name())
	}
}
