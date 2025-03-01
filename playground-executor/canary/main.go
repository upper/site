package main

import (
	"github.com/upper/db/v4/adapter/cockroachdb"
	"github.com/upper/db/v4/adapter/mongo"
	"github.com/upper/db/v4/adapter/mssql"
	"github.com/upper/db/v4/adapter/mysql"
	"github.com/upper/db/v4/adapter/postgresql"
	"github.com/upper/db/v4/adapter/ql"
	"github.com/upper/db/v4/adapter/sqlite"
)

func main() {
	_ = cockroachdb.Adapter
	_ = mongo.Adapter
	_ = mssql.Adapter
	_ = mysql.Adapter
	_ = postgresql.Adapter
	_ = sqlite.Adapter
	_ = ql.Adapter
}
