// ES features that are unavailable across all browsers.
import "core-js/features/string/match-all/";
import "core-js/features/object/from-entries/";

const now = Date.now();
while (now + 50 > Date.now()) {}
