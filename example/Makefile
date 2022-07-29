.PHONY: build

#: Code formatting
fmt:
	flutter format --fix lib/

#: Analyzes the project's Dart source code
lint:
	flutter analyze lib/

#: Build the web app
build:
	flutter build web -v --release --web-renderer html

#: Deploy to surge.sh
deploy:
	surge build/web --domain https://ionicons.ez-connect.net
