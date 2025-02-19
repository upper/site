package main

import (
	"fmt"
	"log"

	"github.com/upper/db/v4/adapter/postgresql"
)

var settings = postgresql.ConnectionURL{
	Database: `booktown`,
	Host:     `postgresql.demo.upper.io`,
	User:     `demouser`,
	Password: `demop4ss`,
}

type Book struct {
	ID        uint   `db:"id,omitempty"`
	Title     string `db:"title"`
	AuthorID  uint   `db:"author_id,omitempty"`
	SubjectID uint   `db:"subject_id,omitempty"`
}

func main() {
	sess, err := postgresql.Open(settings)
	if err != nil {
		log.Fatal("Open: ", err)
	}
	defer sess.Close()

	// The Collection / Find / Result syntax was created with compatibility
	// across all supported databases in mind. However, sometimes it might not be
	// enough for all your needs, especially when working with complex queries.

	// In such a case, you can also use the SQL builder.
	q := sess.SQL().SelectFrom("books")

	// `q` is a `sqlbuilder.Selector`, you can chain any of its other methods
	// that also return `Selector`.
	q = q.OrderBy("title")

	// Note that queries are immutable, here `p` is a completely independent
	// query.
	p := q.Where("title LIKE ?", "P%")

	// Queries are not compiled nor executed until you use methods like `One` or
	// `All`.
	var booksQ, booksP []Book
	if err := q.All(&booksQ); err != nil {
		log.Fatal("q.All: ", err)
	}

	// The `Iterator` method is a way to go through large result sets from top to
	// bottom.
	booksP = make([]Book, 0, len(booksQ))
	iter := p.Iterator()
	var book Book
	for iter.Next(&book) {
		booksP = append(booksP, book)
	}

	// Remember to check for error values at the end of the loop.
	if err := iter.Err(); err != nil {
		log.Fatal("iter.Err: ", err)
	}
	// ... and to free up any locked resources.
	if err := iter.Close(); err != nil {
		log.Fatal("iter.Close: ", err)
	}

	// Listing all books
	fmt.Printf("All books:\n")
	for _, book := range booksQ {
		fmt.Printf("Book %d:\t%q\n", book.ID, book.Title)
	}
	fmt.Println("")

	// Listing books that begin with P
	fmt.Printf("Books that begin with \"P\":\n")
	for _, book := range booksP {
		fmt.Printf("Book %d:\t%q\n", book.ID, book.Title)
	}
	fmt.Println("")
}
