/**
 * Created by lihy on 2017/4/26.
 */

(function () {
    'use strict';
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var subSysFaultSchema = new Schema({
        CNS: {
            L1: {type: Number},
            L2: {type: Number}
        },
        CVS: {
            L1: {type: Number},
            L2: {type: Number}
        },
        DSS: {
            L1: {type: Number},
            L2: {type: Number}
        },
        DTS: {
            L1: {type: Number},
            L2: {type: Number}
        },
        DTS_MRS: {
            L1: {type: Number},
            L2: {type: Number}
        },
        MCS: {
            L1: {type: Number},
            L2: {type: Number}
        },
        NRS: {
            L1: {type: Number},
            L2: {type: Number}
        },
        PGS: {
            L1: {type: Number},
            L2: {type: Number}
        },
        SWS: {
            L1: {type: Number},
            L2: {type: Number}
        }
    });
    subSysFaultSchema.methods.initData = function (body) {
        var self = this;
        for(var prop in body){
            self[prop] = body[prop];
        }
    };
    module.exports = mongoose.model('subsysfault', subSysFaultSchema);

})();