import * as main from '../main.js';
// import * as fileSaver from '../fileSaver/node_modules/file-saver/src/FileSaver.js'
// import {
//     saveAs
// } from '../fileSaver/fileSaver.js';
// var fileSaver = require('../fileSaver/fileSaver.js')

export function generate(op, p1, p2) {
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log("Code GEN");
    console.log(op);
    console.log(p1);
    console.log(p2);
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%");

    // Caso seja uma instrucao
    if (isNaN(op)) {
        // Caso não tenha operadores
        if (p1 == '' && p2 == '') {
            main.codeGen.push(op + " " + " ")
        } else {
            // Caso tenha apenas o 1 op (LDC, LDV, STR, JMP, JMPF, CALL)
            if (p1 != '' && p2 == '') {
                if (op == 'JMPF' || op == 'JMP' || op == 'CALL') {
                    main.codeGen.push(op + ' ' + 'L' + p1 + ' ');
                } else {
                    main.codeGen.push(op + ' ' + p1 + ' ');
                }
            } else { // Caso tenha ambos operadores
                main.codeGen.push(op + ' ' + p1 + ' ' + p2);
            }
        }

        // Caso seja um label (chega um inteiro)
    } else {
        main.codeGen.push('L' + op + ' ' + 'NULL ');
    }
}

export function generateFile(extension) {

    //console.log(main.codeGen.toString());
    let msg = '';
    for (let i = 0; i < main.codeGen.length; i++) {
        msg += main.codeGen[i];
        if (i != main.codeGen.length - 1) {
            msg += '\n';
        }
    }
    //console.log(msg);

    let blob = new Blob([msg], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, 'assembly' + ".obj"); // PARA TESTAR OBJ
    // saveAs(blob, 'assembly' + ".txt");
}