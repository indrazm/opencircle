dev:
	moon :dev

format:
	moon :format

# Docker Commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-build:
	docker-compose build

docker-rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

docker-migrate:
	docker-compose --profile migration up migration

docker-db-reset:
	docker-compose down -v
	docker-compose up -d postgres
	sleep 5
	docker-compose --profile migration up migration

docker-clean:
	docker-compose down -v
	docker system prune -f
