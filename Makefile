#
# Ionicons
# https://github.com/ionic-team/ionicons
#

IONICON_VERSION	?= 7.1.0

# Lists all targets
help:
	@grep -B1 -E "^[a-zA-Z0-9_%-]+\:([^\=]|$$)" Makefile \
		| grep -v -- -- \
		| sed 'N;s/\n/###/' \
		| sed -n 's/^#: \(.*\)###\(.*\):.*/\2###\1/p' \
		| column -t -s '###'

#: Removes untracked files from the working tree
clean:
	flutter clean
	git clean -fdx

#: Install necessary packages
init:
	flutter pub global activate dartdoc

#: Code formatting
fmt:
	dart format --fix lib/

#: Analyzes the project's Dart source code
lint:
	flutter analyze lib/

#: Validation the package  but does not actually upload the package
test:
	dart pub publish --dry-run

#: Genereate TTF from SVG
ttf:
ifeq ($(wildcard bin/tmp/ionicons-$(IONICON_VERSION)),)
	mkdir -p bin/tmp
	curl -Lo bin/tmp/icons.zip https://github.com/ionic-team/ionicons/archive/refs/tags/v$(IONICON_VERSION).zip
	unzip bin/tmp/icons.zip -d bin/tmp/
endif

ifeq ($(shell which oslllo-svg-fixer),)
	npm i -g oslllo-svg-fixer
endif

ifeq ($(shell which svgtofont),)
	npm i -g svgtofont
endif

	mkdir -p bin/tmp/svg
	oslllo-svg-fixer --source=bin/tmp/ionicons-$(IONICON_VERSION)/src/svg --destination=bin/tmp/svg --show-progress
	# svgo -f bin/tmp/svg/ -o bin/tmp/svg2/
	svgtofont --sources bin/tmp/svg --output=bin/tmp/fonts/ --fontName=Ionicons

	cp bin/tmp/fonts/*.ttf assets/fonts/
	rm -rf bin/tmp/fonts/react/

#: Generate source from css
gen:
	node bin/css-to-dart.js bin/tmp/fonts/Ionicons.css lib/ionicons.dart
	# node bin/css-to-dart.js bin/tmp/icons-master/icons.tsv lib/ionicons.dart
	@make -s fmt lint
