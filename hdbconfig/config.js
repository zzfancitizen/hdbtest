module.exports.hdbconfig = {
    host: '10.97.21.49',
    port: '30015',
    user: 'PDMS_TECH_USER',
    password: 'Toor1234'
};

module.exports.hdbsql = {
    select: 'select tplnr from "equi"."IFLOT" where erdat = ?',
    procedure: 'call "PDMS_TECH_USER"."PROC_DUMMY"(?, ?)',
    scadaWraper: 'call "PDMS_TECH_USER"."SCADA_WRAPPER"(?, ?)',
    equiWraper: 'call "PDMS_TECH_USER"."PDMS_TECH_USER"."EQUI_WRAPPER"(?)',
    dummyWraper: 'call "I072179"."WRAPPER_DUMMY"(?, ?, ?)'
};

module.exports.log = {
    scada: './log/ScadaError.log',
    equi: './log/EquiError.log'
};
