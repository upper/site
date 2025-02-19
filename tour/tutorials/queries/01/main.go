package main

import (
	"fmt"
	"log"

	// "github.com/upper/db/v4"
	"github.com/upper/db/v4/adapter/postgresql"
)

var settings = postgresql.ConnectionURL{
	Database: `booktown`,
	Host:     `postgresql.demo.upper.io`,
	User:     `demouser`,
	Password: `demop4ss`,
}

// Book represents an record from the "books" table. The fields accompanying
// the record represent the columns in the table and are mapped to Go values
// below.
type Book struct {
	ID        uint   `db:"id,omitempty"`
	Title     string `db:"title"`
	AuthorID  uint   `db:"author_id"`
	SubjectID uint   `db:"subject_id"`

	SkippedField string
}

func main() {
	sess, err := postgresql.Open(settings)
	if err != nil {
		log.Fatal("postgresql.Open: ", err)
	}
	defer sess.Close()

	booksCol := sess.Collection("books")

	// Uncomment the following line (and the github.com/upper/db import path) to
	// write SQL statements to os.Stdout:
	// db.LC().SetLevel(db.LogLevelDebug)

	// Find().All() maps all the records from the books collection.
	books := []Book{}
	err = booksCol.Find().All(&books)
	if err != nil {
		log.Fatal("booksCol.Find: ", err)
	}

	// Print the queried information.
	fmt.Printf("Records in the %q collection:\n", booksCol.Name())
	for i := range books {
		fmt.Printf("record #%d: %#v\n", i, books[i])
	}
}
