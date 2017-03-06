module.exports.hdbconfig = {
    host: '10.97.21.49',
    port: '30015',
    user: 'PDMS_TECH_USER',
    password: 'Toor1234'
};

module.exports.hdbsql = {
    select: 'select TPLNR from "equi"."IFLOT"',
    procedure: 'call "PDMS_TECH_USER"."PROC_DUMMY" (?, ?, ?, ?)',
    inputPara: {
        VAL1: 1,
        VAL2: 2
    }
};

