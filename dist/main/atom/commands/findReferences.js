"use strict";
const tslib_1 = require("tslib");
const registry_1 = require("./registry");
const atomUtils_1 = require("../atomUtils");
const simpleSelectionView_1 = require("../views/simpleSelectionView");
const escapeHtml = require("escape-html");
registry_1.commands.set("typescript:find-references", deps => {
    return (e) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!atomUtils_1.commandForTypeScript(e)) {
            return;
        }
        const location = atomUtils_1.getFilePathPosition();
        const client = yield deps.getClient(location.file);
        const result = yield client.executeReferences(location);
        simpleSelectionView_1.simpleSelectionView({
            items: result.body.refs,
            viewForItem: item => {
                return `<div>
          <span>${atom.project.relativize(item.file)}</span>
          <div class="pull-right">line: ${item.start.line}</div>
          <ts-view>${escapeHtml(item.lineText.trim())}</ts-view>
        </div>`;
            },
            filterKey: 'filePath',
            confirmed: open
        });
        function open(item) {
            atom.workspace.open(item.file, {
                initialLine: item.start.line - 1,
                initialColumn: item.start.offset - 1
            });
        }
    });
});