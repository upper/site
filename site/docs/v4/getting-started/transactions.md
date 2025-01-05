---
title: Transactions
---

Transactions are special operations that you can carry out with the guarantee
that the whole batch will fail if one fails. A typical example of a transaction
is a bank operation in which you want to move money from one account to another
without worrying about a power failure or a writing error in the middle of a
transaction that would create an inconsistency.

You can create and use transaction blocks with the `Tx` method:

```go
package main

import (
  "log"

  "github.com/upper/db/v4"
)

func main() {
  ...
  err := sess.Tx(func(tx db.Session) error {
    // Use `tx` as you would normally use `sess.`
    ...
    id, err := tx.Collection("accounts").Insert(...)
    if err != nil {
      // Roll-back the transaction by returning an error value.
      return err
    }
    ...

    err := tx.Collection("accounts").Update(...)
    if err != nil {
      // Roll-back the transaction by returning an error value.
      return err
    }
    ...

    rows, err := tx.SQL().Query(...)
    ...

    ...
    // Commit the transaction by returning `nil`.
    return nil
  })
  if err != nil {
    log.Fatal("Transaction failed: ", err)
  }
}
```

See the tour example on how to use transactions.
