#!/bin/bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

for db in mysql5 msyql8 percona5 percona8 mariadb; do
  docker-compose kill
  docker-compose rm -fv
  docker-compose up "$db" app &

  until docker exec -t "uuid_${db}_1" mysql -proot uuid -e 'SELECT 1 FROM obinuuid'; do
    sleep 1
  done
  sleep 3

  docker exec -ti uuid_app_1 node src/index "$db"

  # restart db instance to clear index cache
  docker restart "uuid_${db}_1"

  until docker exec -t "uuid_${db}_1" mysql -proot uuid -e 'SELECT 1 FROM obinuuid'; do
    sleep 1
  done
  sleep 3

  docker exec -ti uuid_app_1 node src/select "$db"
done