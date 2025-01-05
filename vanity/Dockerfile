FROM xiam/vanity:latest

EXPOSE 9001

ENTRYPOINT [ \
  "/bin/vanity", \
  "-addr",        ":9001", \
  "-repo-root",   "https://github.com/upper", \
  "-vanity-root", "https://upper.io" \
]
