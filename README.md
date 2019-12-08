# mysql uuid benchmarks

We can see here or there some articles adivsing to use uuids in place of auto-incremented values 
for MySql primary keys, optionally stored as binary format, i.e.:

* https://mysqlserverteam.com/storing-uuid-values-in-mysql-tables/
* https://www.percona.com/blog/2014/12/19/store-uuid-optimized-way/

Some good arguments are also available to mitigate the first advices, i.e.: https://www.percona.com/blog/2007/03/13/to-uuid-or-not-to-uuid/

I, personnally, was a bit sceptical about the supposed benefits of (binary) uuids, especially considering
real case scenarios I was experiencing where the index cache would most likely fit entirely in memory.

Most typical setup I am using have at least 8GB of memory dedicated to MySQL with a db containing less than 50 tables, the biggest ones
having a couple of hundred thousand records.

I dediced to run some benchmarks on my own *for my situation* to check if we could observe any
benefit and, if so, if i was significant enough to worth the implementation costs.
