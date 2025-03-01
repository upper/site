package main

import (
	"fmt"
	"log"

	"github.com/upper/db/v4"
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

// Book represents a record from the "books" table.
type Book struct {
	ID        uint   `db:"id,omitempty"`
	Title     string `db:"title"`
	AuthorID  uint   `db:"author_id,omitempty"`
	SubjectID uint   `db:"subject_id,omitempty"`
}

func (book *Book) Store(sess db.Session) db.Store {
	return sess.Collection("books")
}

func (book *Book) BeforeUpdate(sess db.Session) error {
	fmt.Println("**** BeforeUpdate was called ****")
	return nil
}

func (book *Book) AfterUpdate(sess db.Session) error {
	fmt.Println("**** AfterUpdate was called ****")
	return nil
}

// Interface checks
var _ = interface {
	db.Record
	db.BeforeUpdateHook
	db.AfterUpdateHook
}(&Book{})

func main() {
	sess, err := postgresql.Open(settings)
	if err != nil {
		log.Fatal("Open: ", err)
	}
	defer sess.Close()

	var book Book

	// Get a book
	err = sess.Get(&book, db.Cond{"title": "The Shining"})
	if err != nil {
		log.Fatal("Get: ", err)
	}

	fmt.Printf("book: %#v\n", book)

	// Change the title
	book.Title = "The Shining (novel)"

	// Persist changes
	err = sess.Save(&book)
	if err != nil {
		// Allow this to fail in the sandbox
		log.Print("Save: ", err)
	}
}
