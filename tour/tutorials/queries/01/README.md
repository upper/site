# Map database records to Go structs

Let's suppose the database we're working on has a "books" table that was
created like this:

```sql
CREATE TABLE "books" (
  "id" INTEGER NOT NULL,
  "title" VARCHAR NOT NULL,
  "author_id" INTEGER,
  "subject_id" INTEGER,
  CONSTRAINT "books_id_pkey" PRIMARY KEY ("id")
);
```

We can represent a single record from such a table and the fields accompanying
it with a Go struct accompanied by struct tags in exported fields:

```go
type Book struct {
  ID          uint   `db:"id"`
  Title       string `db:"title"`
  AuthorID    uint   `db:"author_id"`
  SubjectID   uint   `db:"subject_id"`
}
```

The `db` field tag is required so `upper/db` can map columns to struct fields.

Please note that:

* Fields and columns must be of compatible types (`upper/db` will handle most
  reasonable conversions automatically).
* Fields must be exported and have a `db` tag; otherwise, they will be ignored.

If the table contains a special column to represent automatically-generated
values like IDs, serials, dates, etc. add the `omitempty` option to the field
tag:

```go
type Book struct {
  ID uint `db:"id,omitempty"`
}
```

The `omitempty` option will make `upper/db` ignore zero-valued fields when
building `INSERT` and `UPDATE` statements so the database can correctly
generate them.
