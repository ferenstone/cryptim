# The zip application to be used.
ZIP := zip


ifneq ($(m),)
xpi_file := ../cryptim_v$(v).xpi
git := git
install_rdf:=install_rdf
mm := -m "$(m)"
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
git: $(xpi_file) $(install_rdf)
	@git add $(xpi_file)
	@git status
	@git commit -a $(mm)
	@git tag -a v$(v) $(mm)
	@git push server master v$(v)


.PHONY:install_rdf
install_rdf:
	@sed  's/<em:version>.*<\/em:version>/<em:version>$(v)<\/em:version>/g' install.rdf > install.rdf.new
	@mv install.rdf.new install.rdf


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


$(xpi_file): $(sources) $(install_rdf)
	@echo "Creating XPI file."
	@rm ../cryptim*.xpi
	@$(ZIP) $(xpi_file) $(sources)
	@echo "Creating XPI file. Done!"

