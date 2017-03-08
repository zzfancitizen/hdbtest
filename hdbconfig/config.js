module.exports.hdbconfig = {
    host: '10.97.21.49',
    port: '30015',
    user: 'PDMS_TECH_USER',
    password: 'Toor1234'
};

module.exports.hdbsql = {
    select: 'select tplnr from "equi"."IFLOT" where erdat = ?',
    procedure: 'call "PDMS_TECH_USER"."PROC_DUMMY"(?, ?)'
};

