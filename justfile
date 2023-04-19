alias f := fmt
alias l := lint
alias g := gen
alias b := build

ionicon_version := "8.1.0"

# Lists all targets
@help:
    just -l --unsorted

# Removes untracked files from the working tree
clean:
    flutter clean
    cd example && flutter clean
    # git clean -fdx

# Install necessary packages
init:
    dart pub global activate dartdoc

# Code formatting
fmt:
    just --fmt
    dart fix --apply
    dart format lib/ example/lib/

# Analyzes the project's Dart source code
lint:
    flutter analyze lib/ example/lib

# Validate the package but does not actually upload the package
test:
    dart pub publish --dry-run

# Generate TTF from SVG
[group('ttf')]
ttf:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -d "bin/tmp/ionicons-{{ ionicon_version }}" ]; then
        mkdir -p bin/tmp
        curl -Lo bin/tmp/icons.zip https://github.com/ionic-team/ionicons/archive/refs/tags/v{{ ionicon_version }}.zip
        unzip bin/tmp/icons.zip -d bin/tmp/
    fi

    mkdir -p bin/tmp/svg
    bunx -b oslllo-svg-fixer --source=bin/tmp/ionicons-{{ ionicon_version }}/src/svg --destination=bin/tmp/svg --show-progress
    # svgo -f bin/tmp/svg/ -o bin/tmp/svg2/
    bunx -b svgtofont --sources bin/tmp/svg --output=bin/tmp/fonts/ --fontName=Ionicons

    cp bin/tmp/fonts/*.ttf assets/fonts/
    rm -rf bin/tmp/fonts/react/

# Generate source from css
[group('ttf')]
gen:
    bun -b bin/css-to-dart.ts --input=bin/tmp/fonts/Ionicons.css --output=lib/ionicons.dart
    just f l

# Publish the current package to pub.dev
publish:
    dart pub publish

[group('example')]
build:
    #!/usr/bin/env bash
    version=$(sed -n 's/^version:[[:space:]]*//p' pubspec.yaml)
    cd example
    flutter build web --wasm --dart-define VERSION=${version}

# Deploy the example site
[group('example')]
deploy:
    cd example; bunx wrangler pages deploy;
