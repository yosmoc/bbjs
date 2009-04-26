var BB = function(n) {
    if (!(!isNaN(n) && n.length == 12 && n.match(/[0-9]+/))) return;

    this.n = n;
    this.barcode = [];
    for (i = 0, l = n.length; i < l; i++) {
        this.barcode.push(parseInt(n.charAt(i)));
    }
    this.barcode.push(this._mn(this.barcode));
    this.calc(this.barcode);
};

BB.prototype = {
    _mn: function(buf) {
        var a = (1000 - ((buf[11] + buf[9] + buf[7] + buf[5] + buf[3] + buf[1]) * 3 ) + buf[10] + buf[8] + buf[6] + buf[4] + buf[2] + buf[0]) + "";
        return parseInt(a.charAt(2) + this.n);
    },

    calc: function(buf) {
        if (buf[0] == (0,1)) {
            if (buf[7] <= 4) {
                this.hp = buf[0]*10000 + buf[1]*1000 + buf[2]*100;
                this.bp = buf[3]*1000 + buf[4]*100;
                this.dp = buf[5]*1000 + buf[6]*100;
                this.comment = this._comment(buf[7]);
                this.job = this._job(buf[8]);
                if (buf[10] == 2) {
                    this.ability = this._ability(buf[11]);
                } else {
                    if (buf[10] == 4 && buf[11] == 5) {
                        this.ability = this._ability(10);
                    } else {
                        this.ability = this._ability(0);
                    }
                }
            } else {
                switch (buf[12]) {
                case 5, 6:
                    this.hp = "";
                    switch (buf[10]) {
                    case 0, 1, 2, 9:
                        this.bp = 2000 + this._bp_100(buf[9]);
                        break;
                    case 3, 4:
                        this.bp = 3000 + this._bp_100(buf[9]);
                        break;
                    case 5, 6, 7, 8:
                        this.bp = 1000 + this._bp_100(buf[9]);
                        break;
                    default:
                        break;
                    }
                    this.dp = "";
                    break;
                case 7, 8: 
                    this.hp = "";
                    this.bp = "";
                    switch (buf[9]) {
                    case 0, 7, 8, 9:
                        this.dp = 1000 + this._bp_100(buf[8]);
                        break;
                    case 1, 2:
                        this.dp = 2000 + this._bp_100(buf[8]);
                        break;
                    case 3, 4, 5, 6:
                        this.dp = this._bp_100(buf[8]);
                        break;
                    default:
                        break;
                    }
                    this.dp = "";
                    break;
                case 9:
                    switch(buf[11]) {
                    case 8, 9:
                        this.hp = 10000 + buf[10]*1000 + buf[9]*100;
                        break;
                    default:
                        this.hp = buf[10]*1000 + buf[9]*100;
                        break;
                    }
                    this.bp = "";
                    this.dp = "";
                    break;
                default:
                    switch(buf[12]) {
                    case 0, 1, 2, 3, 4:
                        this.hp = this._hp(buf[11]) + buf[10]*1000 + buf[9]*100;
                        this.bp = this._bp(buf[10]) + this._bp_100(buf[9]);
                        this.dp = this._dp(buf[9]) + this._dp_100(buf[8]);
                        break;
                    defalut:
                        return "error";
                    }
                    break;
                }
                this.comment = this._comment(buf[12]);
                if (buf[12] <= 4) {
                    this.job = this._job(buf[5]);
                } else {
                    this.job = "";
                }
                if (buf[8] >= 8) {
                    this.ability = this._ability(buf[10]);
                } else {
                    this.ability = "";
                }
            }
        } else {
            if (buf[2] == 9 && buf[9] == 5) {
                switch (buf[7]) {
                case 0, 1:
                    this.hp = buf[0]*10000 + buf[1]*1000 + buf[2]*100;
                    this.bp = buf[3]*1000 + buf[4]*100 + 10000;
                    this.dp = buf[5]*1000 + buf[6]*100;
                    break;
                case 2:
                    this.hp = buf[0]*10000 + buf[1]*1000 + buf[2]*100;
                    this.bp = buf[3]*1000 + buf[4]*100 + 10000;
                    this.dp = buf[5]*1000 + buf[6]*100 + 10000;
                    break;
                case 3, 4:
                    this.hp = buf[0]*10000 + buf[1]*1000 + buf[2]*100;
                    this.bp = buf[3]*1000 + buf[4]*100;
                    this.dp = buf[5]*1000 + buf[6]*100;
                    break;
                case 5, 6:
                    this.hp = "";
                    this.bp = buf[3]*1000 + buf[4]*100;
                    this.dp = "";
                    break;
                case 7, 8:
                    this.hp = "";
                    this.bp = "";
                    this.dp = buf[5]*1000 + buf[6]*100;
                    break;
                case 9:
                    if (buf[8] >= 5) {
                        this.hp = "";
                        this.bp = "";
                        this.dp = "";
                    } else {
                        this.hp = buf[0]*10000 + buf[1]*1000 + buf[2]*100;
                        this.bp = "";
                        this.dp = "";
                    }
                    break;
                default:
                    return 'error';
                    break;
                }
                if (buf[7] == 9) {
                    switch(buf[8]) {
                    case 5, 6:
                        this.comment = this._comment(10);
                    case 7:
                        this.comment = this._comment(12) + "+" + buf[3]*10 + buf[4];
                        break;
                    case 8, 9:
                        this.comment = this._comment(12) + "+" + buf[5]*10 + buf[6];
                        break;
                    default:
                        this.comment = this._comment(buf[7]);
                        break;
                    }
                } else {
                    this.comment = this._comment(buf[7]);
                }
                if (buf[7] <= 4) {
                    this.job = this._job(buf[8]);
                } else {
                    this.job = "";
                }
                if (buf[10] == 2) {
                    this.ability = this._ability(buf[11]);
                } else {
                    if (buf[10] == 4 && buf[11] == 5) {
                        this.ability = this._ability(10);
                    } else {
                        this.ability = this._ability(0);
                    }
                }
            } else {
                switch (buf[12]) {
                case 5, 6:
                    this.hp = "";
                    switch (buf[10]) {
                    case 0, 1, 2, 9:
                        this.bp = 2000 + this._bp(buf[9]);
                        break;
                    case 3, 4:
                        this.bp = 3000 + this._bp(buf[9]);
                        break;
                    case 5, 6, 7, 8:
                        this.bp = 1000 + this._bp(buf[9]);
                        break;
                    default:
                        return 'error';
                        break;
                    }
                    this.dp = "";
                    break;
                case 7, 8:
                    this.hp = "";
                    this.bp ="";
                    switch (buf[9]) {
                    case 0, 7, 8, 9:
                        this.dp = 1000 + this._dp_100(buf[8]);
                        break;
                    case 1, 2:
                        this.dp = 2000 + this._dp_100(buf[8]);
                        break;
                    case 3, 4, 5, 6:
                        this.dp = this._dp_100(buf[8]);
                        break;
                    default:
                        return 'error';
                        break;
                    }
                    break;
                case 9:
                    if (buf[11] == (8, 9)) {
                        this.hp = 10000 + buf[10]*1000 + buf[9]*100;
                    } else {
                        this.hp = buf[10]*1000 + buf[9]*100;
                    }
                    this.bp = "";
                    this.dp = "";
                    break;
                default:
                    switch (buf[12]) {
                    case 0, 1, 2, 3, 4:
                        this.hp = this._hp(buf[11]) + buf[10]*1000 + buf[9]*100;
                        this.bp = this._bp(buf[10]) + this._bp_100(buf[9]);
                        this.dp = this._dp(buf[9]) + this._dp_100(buf[8]);
                        break;
                    default:
                        return 'error';
                        break;
                    }
                    break;
                }
                this.comment = this.comment(buf[12]);
                if (buf[12] <= 4) {
                    this.job = this._job(buf[5]);
                } else {
                    this.job = "";
                }
                if (buf[8] >= 8) {
                    this.ability = this._ability(buf[10]);
                } else {
                    this.ability = "";
                }
            }
        }
    },

    _hp: function(n) {
        var hp = [0,0,10000,10000,20000,20000,30000,30000,40000,40000];
        return hp[n];
    },

    _bp: function(n) {
        var bp = [7000,8000,9000,10000,11000,2000,3000,4000,5000,6000];
        return bp[n];
    },

    _bp_100: function(n) {
        var bp_100 = [500,600,700,800,900,0,100,200,300,400];
        return bp_100[n];
    },

    _dp: function(n) {
        var dp = [7000,8000,9000,0,1000,2000,3000,4000,5000,6000];
        return dp[n];
    },

    _dp_100: function(n) {
        var dp_100 = [700,800,900,0,100,200,300,400,500,600];
        return dp_100[n];
    },

    item: function() {
    },

    _comment: function(n) {
        var comment = ["’¡Ý","’¡Ý","’¡Ý","’¡Ý","’¡Ý","’¹¶’·â’ÎÏ’¥¢’¥Ã’¥×(’»È’¤¤’¼Î’¤Æ)","’¹¶’·â’ÎÏ’¥¢’¥Ã’¥×",
                      "’ËÉ’¸æ’ÎÏ’¥¢’¥Ã’¥×(’»È’¤¤’¼Î’¤Æ)","’ËÉ’¸æ’ÎÏ’¥¢’¥Ã’¥×","’£È’£Ð’¥¢’¥Ã’¥×","’¾ð’Êó’¥«’¡¼’¥É",
                      "’Ìô’Áð","’£Í’£Ð’¥¢’¥Ã’¥×"];
        return comment[n];
    },
    
    _job: function(n) {
        var job = ["’Àï’»Î","’Àï’»Î","’Àï’»Î","’Àï’»Î","’Àï’»Î","’Àï’»Î","’Àï’»Î","’Ëâ’Ë¡’»È’¤¤",
                       "’Ëâ’Ë¡’»È’¤¤","’Ëâ’Ë¡’»È’¤¤"];
        return job[n];
    },

    _ability: function(n) {
        var ability = ["’¡Ý","’¡Ý","’¡Ý","’¹¶’·â’ÎÏ’£·’¡¿’£±’£°","’¹¶’·â’ÎÏ’£±’¡¿’£²","’¼é’È÷’ÎÏ’£·’¡¿’£±’£°",
                       "’¼é’È÷’ÎÏ’£±’¡¿’£²","’¼é’È÷’ÎÏ’£´’¡¿’£µ","’£È’£Ð’£·’¡¿’£±’£°","’£È’£Ð’£±’¡¿’£²",
                       "’ÆÃ’¼ì’Ç½’ÎÏ’Ìµ’¸ú"];
        return ability[n];
    }
};

function log(messege) {
    console.log(messege);
};

bb = new BB("490108501489");
log(bb.buf);
log(bb.hp);


    