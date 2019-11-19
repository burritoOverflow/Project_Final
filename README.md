# Final Project

To run mongod as a MacOS service:
```
$ brew services start mongodb-community
```

To run MongoDB manually as a background process, issue the following:
```
mongod --config /usr/local/etc/mongod.conf --fork
```
