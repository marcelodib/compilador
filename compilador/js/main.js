/**
 * ====================================================================
 * ---------------------------COMPILADORES-----------------------------
 * ====================================================================
 */

/**
 * Maquina Virtual para disciplina de compiladores.
 * - Guilherme Soderi Pernicone           RA: 16085037
 * - Marcelo Dib Coutinho                 RA: 16023673
 * - Paulo Jansen de Oliveira Figueiredo  RA: 16043028
 */

/**
 * ====================================================================
 * -------------------------IMPORT-------------------------------------
 * ====================================================================
 */
/**
 * Para ver como funciona olhe os links a baixo:
 * https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
 * https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/import
 * https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/export
 */
import * as lexico from './lexico/lexico.js';
import * as sintatico from './sintatico/sintatico.js';
import * as template from './exceção/template.js';
import * as exception from './exceção/exception.js';
import * as token from './lexico/token.js';
import * as codeGeneration from './semantico/codeGen.js';

/**
 * ====================================================================
 * -------------------------EVENTS-------------------------------------
 * ====================================================================
 */
// Por se tratar de um modulo javascript (.mjs) os eventos nao funcionam diretamente no HTML,
// Sendo assim necessario adicionalos via addEventListener.
document.getElementById('import_file').addEventListener('change', function () {
    readText(this);
});
document.getElementById('compilador').addEventListener('click', main);

let myCodeMirror = CodeMirror(document.getElementById('code'), {
    lineNumbers: true,
    theme: "dracula",
});
myCodeMirror.setSize(null, "65%");
/**
 * ====================================================================
 * -------------------------VARIAVEIS GLOBAIS--------------------------
 * ====================================================================
 */
// Variavel que conterá todo codigo fonte.
let program;
// Array que conterá todos os tokens lidos do condigo fonte.
export let tokens = [];
export let simbolTable = [];
export let codeGen = [];

/**
 * ====================================================================
 * ------------------------------EXECUÇÃO------------------------------
 * ====================================================================
 */

function main() {
    document.getElementById("terminal").innerHTML = ">";
    try {
        // //console.log("program: " + program);
        readProgramFile();
        clear();
        lexico.lexico(program);
        //console.log(tokens);
        if (tokens.length == 0) {
            return;
        }
        sintatico.sintatico(tokens);
        //console.log(simbolTable);
        //console.log(codeGen);
        codeGeneration.generateFile();
    } catch (error) {
        // //console.log(error);
        document.getElementById("terminal").innerHTML = template.templateTerminal(error);
    }
}

export function readText(that) {
    if (that.files && that.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let output = e.target.result;
            program = output;
            // readProgramFile();
            writeOnTerminal();
        };
        reader.readAsText(that.files[0]);
    }

}

function writeOnTerminal() {
    myCodeMirror.setValue(program.toString());
}

function readProgramFile() {
    program = myCodeMirror.getValue();
    program = program.split("\n");
    return;
}

function clear() {
    tokens = [];
    simbolTable = [];
    codeGen = [];
    exception.limpaException();
}