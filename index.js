const urlPattern = require("url-pattern");
const mm = require('micromatch');

const defaultOptions = {
  strict: false
};

function removeTrailingSlash(s)     
{     
    if (s.length <= 1) {
        return s;
    }
    return s.replace(/\/$/, "");
} 

function match(p, str, options) {
    options = !!options ? options : defaultOptions;

    if (!options.strict) {
      p = removeTrailingSlash(p);
      str = removeTrailingSlash(str);
    }

    const pattern = new urlPattern(p);
    const components = pattern.match(str);
    
    if (!components) {
        return false;
    }
    
    // restore pattern so we can do wildcard match
    const componentsRestorer = {};
    for (let key in components) {
        if (key !== '_') {
            componentsRestorer[key] = `:${key}`;
        } else {
            componentsRestorer[key] = components[key];
        }
    }
    
    const restoredPath = pattern.stringify(componentsRestorer);
    return mm.isMatch(restoredPath, p) && components;
}

module.exports = match;