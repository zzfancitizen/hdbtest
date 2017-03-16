var date = new Date();

Date.prototype.format = function (format) {
    var output = '';
    if (format == 'YYYY-MM-DD HH24:MI:SS') {
        output = this.getFullYear();
        if (String(this.getMonth() + 1).length == 1) {
            output += '-0' + String(this.getMonth() + 1);
        } else {
            output += '-' + String(this.getMonth() + 1);
        };
        if (String(this.getDate()).length == 1) {
            output += '-0' + this.getDate();
        } else {
            output += '-' + this.getDate();
        };
        if (String(this.getHours()).length == 1) {
            output += ' 0' + this.getHours();
        } else {
            output += ' ' + this.getHours();
        };
        if (String(this.getMinutes()).length == 1) {
            output += ':0' + this.getMinutes();
        } else {
            output += ':' + this.getMinutes();
        };
        if (String(this.getSeconds()).length == 1) {
            output += ':0' + this.getSeconds();
        } else {
            output += ':' + this.getSeconds();
        };
        return output;
    }
};
