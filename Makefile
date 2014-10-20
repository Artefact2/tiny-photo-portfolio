SRC_IMAGES = $(shell find in -type f -name '*.tif')

DEST_IMAGES = $(patsubst in/%.tif, out/%.jpg, $(SRC_IMAGES))
DEST_THUMBS = $(patsubst %.jpg, %.thumb.jpg, $(DEST_IMAGES))
DEST_FILES = $(patsubst in/%, out/%, $(shell find in -type f -not -name '*.tif'))

default: out out/tpp.min.js $(DEST_FILES) $(DEST_IMAGES) $(DEST_THUMBS)

out:
	mkdir -p out

out/index.xhtml: in/index.xhtml $(SRC_IMAGES)
	./src/make-index.php $@ $^

out/t.css: in/t.scss
	sass --unix-newlines -t compact $< | tr -s '\n' > $@

out/tpp.min.js: in/tpp.js
	uglifyjs $< -mc -o $@

out/%.thumb.jpg: in/%.tif out
	convert $< -filter Lanczos -unsharp 1.5x1+0.7+0.02 -thumbnail 800x800 -quality 80 $@

out/%.jpg: in/%.tif out
	convert $< -filter Lanczos -unsharp 1.5x1+0.7+0.02 -border 40 -bordercolor '#FFFFFF' -quality 90 -resize 2000x2000 $@

out/%: in/%
	cp -a $< $@

clean:
	rm -Rf out

.PHONY: clean default
