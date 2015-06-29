FULL_SIZE = 2000x2000
THUMB_SIZE = 256x256

SRC_IMAGES = $(shell find img -type f -not -name ".empty")

DEST_IMAGES = $(patsubst img/%, out/img/%.bpg, $(SRC_IMAGES))
DEST_THUMBS = $(patsubst img/%, out/img/%.thumb.bpg, $(SRC_IMAGES))
TMP_IMAGES = $(patsubst img/%, tmp/%.png, $(SRC_IMAGES))
TMP_THUMBS = $(patsubst img/%, tmp/%.thumb.png, $(SRC_IMAGES))
DEST_FILES = $(patsubst in/%, out/%, $(shell find in -type f))

default: tmp out $(TMP_IMAGES) $(TMP_THUMBS) $(DEST_FILES) $(DEST_THUMBS) $(DEST_IMAGES) out/t.css

tmp:
	mkdir -p tmp

out:
	mkdir -p out

out/img: out
	mkdir -p out/img

out/index.xhtml: in/index.xhtml $(SRC_IMAGES)
	./src/make-index.php $@ $^

out/t.css: in/t.scss
	sass --unix-newlines -t compact $< | tr -s '\n' > $@

tmp/%.thumb.png: img/%
	convert $< -filter Lanczos -unsharp 1.5x1+0.7+0.02 -thumbnail $(THUMB_SIZE)^ -gravity center -extent $(THUMB_SIZE) $@

tmp/%.png: img/%
	convert $< -filter Lanczos -unsharp 1.5x1+0.7+0.02 -resize $(FULL_SIZE) $@

out/img/%.thumb.bpg: tmp/%.thumb.png out/img
	bpgenc -m 9 -o $@ $<

out/img/%.bpg: tmp/%.png out/img
	bpgenc -m 9 -o $@ $<

out/%: in/%
	cp -a $< $@

clean:
	rm -Rf out tmp

.PHONY: clean default
