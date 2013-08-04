# The zip application to be used.
ZIP := zip

# The target XPI file.
ifneq ($(v),)
xpi_file := ../cryptim_v$(v).xpi
git := git
else
xpi_file := ../cryptim$(v).xpi
endif


# This builds the extension XPI file.
.PHONY: all
all: $(xpi_file) $(git)
	@echo
	@echo "Build finished successfully."
	@echo

.PHONY: git
git:
	@git commit -a -m '$(m)'
	@git tag -a v$(v) -m '$(m)'
	@git push server v$(v)

# This cleans all temporary files and directories created by 'make'.
.PHONY: clean
clean:
	@rm -f $(xpi_file)
	@echo "Cleanup is done."

# The sources for the XPI file.
sources := install.rdf \
             chrome.manifest \
             $(wildcard content/*.js) \
             $(wildcard content/*.xul) \
             $(wildcard content/*.xml) \
             $(wildcard content/*.css) \
             $(wildcard defaults/preferences/*.js) 


$(xpi_file): $(sources)
	@echo "Creating XPI file."
	@rm ../cryptim*.xpi
	@$(ZIP) $(xpi_file) $(sources)
	@echo "Creating XPI file. Done!"

