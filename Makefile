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

# Database Commands
docker-migrate:
	docker-compose --profile migration up migration

docker-db-reset:
	docker-compose down -v
	docker-compose up -d postgres
	sleep 5
	docker-compose --profile migration up migration

# Development Commands
docker-dev:
	docker-compose up -d postgres redis
	sleep 5
	docker-compose --profile migration up migration
	docker-compose up -d api celery platform admin

docker-clean:
	docker-compose down -v
	docker system prune -f

# Individual Services
docker-api:
	docker-compose up -d api

docker-platform:
	docker-compose up -d platform

docker-admin:
	docker-compose up -d admin

# Tools
docker-tools:
	docker-compose --profile tools up -d adminer

# Status
docker-ps:
	docker-compose ps

docker-health:
	docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
