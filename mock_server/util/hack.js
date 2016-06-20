
String.prototype.format = function () {
    if (arguments.length == 0) {
        return this;
    }
    for (var s = this, i = 0; i < arguments.length; i++) {
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    }
    return s;
};

String.prototype.replaceAll  = function(s1,s2){     
    return this.replace(new RegExp(s1,"gm"),s2);     
}
