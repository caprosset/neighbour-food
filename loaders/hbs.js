function registerHelpers(hbsModule) {
hbsModule.registerHelper('ifeq', function(a, b, options){
    if (a === b) {
        return options.fn(this);
    }
        return options.inverse(this);
    });
    hbsModule.registerHelper('ifeqId', function(a, b, options){
    if (a.equals(b)) {
        return options.fn(this);
    }
        return options.inverse(this);
    });
    hbsModule.registerHelper('ifinc', function(array, value, options){
    if (array.includes(value)) {
        return options.fn(this);
    }
        return options.inverse(this);
    });
}

module.exports = registerHelpers;