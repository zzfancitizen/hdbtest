Date.prototype.format = function (format) {
    var output = '';
    if (format == 'YYYY-MM-DD') {
        output = this.getFullYear();
        if (String(this.getMonth() + 1).length == 1) {
            output += '-0' + String(this.getMonth() + 1);
        } else {
            output += '-' + String(this.getMonth() + 1);
        }
        if (String(this.getDate()).length == 1) {
            output += '-0' + this.getDate();
        }  else {
            output += '-' + this.getDate();
        }
        return output;
    }
};

var date = new Date('2013-03-05').format('YYYY-MM-DD');

var obj = {
    TPLNR: 'S-04388-001-EK'
};

Object.prototype.values = function (obj) {
    
}