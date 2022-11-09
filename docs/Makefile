%.png: %.svg
	inkscape \
		--export-type=png --export-dpi=400 \
		--export-background-opacity=0 $<

overview.svg: overview.dot Anki-icon.png
	dot -Tsvg $< -o$@
