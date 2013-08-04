# The zip application to be used.
ZIP := zip


# The target XPI file.
xpi_file := ../cryptim.xpi



# This builds the extension XPI file.
.PHONY: all
all: $(xpi_file)
	@echo
	@echo "Build finished successfully."
	@echo

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
	@$(ZIP) $(xpi_file) $(sources)
	@echo "Creating XPI file. Done!"

