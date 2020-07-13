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
 * -------------------------VARIAVEIS GLOBAIS--------------------------
 * ====================================================================
 */

/**
 * Variavel que contem todo contudo do arquivo.obj subido
 */
let fileContent;

/**
 * Variavel de controle para percorrer a pilha de memoria.
 */
let s = -1;

/**
 * Variavel de controle para percorrer a lista de instruções a serem executadas.
 */
let i = 0;

/**
 * Vetor responsavel por simular a pilha de memoria.
 */
let memory = [];

/**
 * Vetor responsavel por simular a lista de instruções a serem executadas.
 */
let instructions = [];

/**
 * Variavel de controle para identificar qual operação deve ser executada.
 */
let op = '';

/**
 * Variavel de controle para identificar quando o programa deve finalizar a execução.
 */
let exec = true;

/**
 * Contador para lista de instruções
 */
let numInstrucao = 1;

/**
 * Variavel de controle para modo debug.
 * 
 * bool valueCheckBox -> valor da checkbox,
 * bool excutando -> indica se o processo está em andamento,
 * array instruction -> array com as instruções de debug
 */
let debug = {
    valueCheckBox: false,
    executando: false,
    instruction: []
};


/**
 * ====================================================================
 * ------------------------------EXECUÇÃO------------------------------
 * ====================================================================
 */

function execute() {
    // //console.log(debug.executando);
    if (!debug.executando) {
        exec = true;
        memory = [];
        i = 0;
        s = -1;
        if (debug.valueCheckBox) {
            debug.instruction = [];
            for (num in instructions) {
                if (document.getElementById("checkbox_" + num).checked) {
                    debug.instruction.push(num);
                }
            }
        }
    }
    main();
}

/**
 * Função main responsavel por executar um loop lendo o codigo de operação
 * das instruções e chamando as funções equivalentes corretamente.
 */
function main() {
    while (exec) {
        op = instructions[i].op;
        let emDebug = false;
        index = debug.instruction.indexOf(i.toString());
        if (debug.valueCheckBox && index >= 0) emDebug = true;
        // //console.log(debug.instruction);
        // //console.log("index: " + index);
        // //console.log("i: " + i);
        // //console.log("op: " + op);
        // //console.log("emDebug: " + emDebug);
        switch (op) {
            case "LDC":
                ldc();
                break;
            case "LDV":
                ldv();
                break;
            case "ADD":
                add();
                break;
            case "SUB":
                sub();
                break;
            case "MULT":
                mult();
                break;
            case "DIVI":
                divi();
                break;
            case "INV":
                inv();
                break;
            case "AND":
                and();
                break;
            case "OR":
                or();
                break;
            case "NEG":
                neg();
                break;
            case "CME":
                cme();
                break;
            case "CMA":
                cma();
                break;
            case "CEQ":
                ceq();
                break;
            case "CDIF":
                cdif();
                break;
            case "CMEQ":
                cmeq();
                break;
            case "CMAQ":
                cmaq();
                break;
            case "START":
                start();
                break;
            case "HLT":
                hlt();
                break;
            case "STR":
                str();
                break;
            case "JMP":
                jmp();
                break;
            case "JMPF":
                jmpf();
                break;
            case "NULL":
                break;
            case "RD":
                rd();
                break;
            case "PRN":
                prn();
                break;
            case "ALLOC":
                alloc();
                break;
            case "DALLOC":
                dalloc();
                break;
            case "CALL":
                call();
                break;
            case "RETURN":
                ret();
                i = i - 1;
                break;
            case "RETURNF":
                retf();
                i = i - 1;
                break;
            default:
                break;
        }
        // console.log("===================");
        // console.log("instruction " + op);
        // console.log("memory " + memory);
        // console.log("i " + i);
        // console.log("s " + s);
        // console.log("===================");
        attMemoria();
        //
        i = i + 1;

        if (emDebug && exec != false) {
            debug.executando = true;
            break;
        }
    }
}


function readText(that) {
    // //console.log(document.getElementById("teste"));
    if (that.files && that.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var output = e.target.result;
            fileContent = output;
            readObjectFile(fileContent);
        }; //end onload()
        reader.readAsText(that.files[0]);
    }
    //end if html5 filelist support
    // document.getElementById("assembly").submit();
}

function readObjectFile(assembly) {
    assembly = assembly.toString();

    let auxInstruction;

    assembly = assembly.split("\n");
    // console.log(assembly);

    document.getElementById("tabelaInstrucoes").innerHTML = "";
    for (const index in assembly) {

        document.getElementById("tabelaInstrucoes").innerHTML += templateItemInstrução(assembly[index], index);
        auxInstruction = assembly[index].split(" ");
        // console.log(auxInstruction);


        auxInstruction[0] = auxInstruction[0].replace(/\W/g, '');
        if (auxInstruction[1] != undefined) {
            auxInstruction[1] = auxInstruction[1].replace(/\W/g, '');
        }
        if (auxInstruction[2] != undefined) {
            auxInstruction[2] = auxInstruction[2].replace(/\W/g, '');
        }

        if (auxInstruction[1] === "NULL") {
            instructions.push({
                op: auxInstruction[1],
                label: auxInstruction[0],
                index: parseInt(index)
            });
        } else {
            // Tem 1 parâmetro
            if (auxInstruction[1].length >= 1) {
                //Tem 2 parâmetros
                if (auxInstruction[2].length >= 1) {
                    // console.log(auxInstruction);

                    instructions.push({
                        op: auxInstruction[0],
                        parameters: {
                            p1: parseInt(auxInstruction[1]),
                            p2: parseInt(auxInstruction[2])
                        }
                    });

                } else {
                    instructions.push({
                        op: auxInstruction[0],
                        parameters: {
                            p1: isNaN(auxInstruction[1]) ? auxInstruction[1] : parseInt(auxInstruction[1])
                        }
                    });

                }

            } else {
                instructions.push({
                    op: auxInstruction[0]
                });
            }
        }
    }
    // //console.log(instructions);
    // //console.log(document.getElementById("teste"));
    // document.getElementById("teste").innerHTML += templateItemInstrução(instructions[0], 1);
    return;
}
/**
 * ====================================================================
 * -------------------------FUNÇÕES DE ENTRADA E SAIDA-----------------
 * ====================================================================
 */


function readEntry() {
    return parseInt(prompt("Entre um valor"));
}

function printValue(value) {
    alert(value);
}
/**
 * ====================================================================
 * -------------------------FUNÇÕES ARITMETICAS------------------------
 * ====================================================================
 */

/**
 * Operação ADD - Adição.
 */
function add() {
    memory[s - 1] = parseInt(memory[s - 1] + memory[s]);
    s = s - 1;
}

/**
 * Operação SUB - Subtração.
 */
function sub() {
    memory[s - 1] = parseInt(memory[s - 1] - memory[s]);
    s = s - 1;
}

/**
 * Operação MULT - Multiplicação.
 */
function mult() {
    memory[s - 1] = parseInt(memory[s - 1] * memory[s]);
    s = s - 1;
}

/**
 * Operação DIVI - Divisão.
 */
function divi() {
    memory[s - 1] = parseInt(memory[s - 1] / memory[s]);
    s = s - 1;
}

/**
 * Operação INV - Inversão.
 */
function inv() {
    memory[s] = memory[s] * -1;
}

/**
 * ====================================================================
 * -------------------------FUNÇÕES LOGICAS----------------------------
 * ====================================================================
 */

/**
 * Operação AND - And logico.
 */
function and() {
    if (memory[s - 1] == 1 && memory[s] == 1) {
        memory[s - 1] = 1;
    } else {
        memory[s - 1] = 0;
    }
    s = s - 1;
}

/**
 * Operação OR - Or logico.
 */
function or() {
    if (memory[s - 1] == 1 || memory[s] == 1) {
        memory[s - 1] = 1;
    } else {
        memory[s - 1] = 0;
    }
    s = s - 1;
}

/**
 * Operação NEG - Complemento.
 */
function neg() {
    memory[s] = 1 - memory[s];
}

/**
 * ====================================================================
 * -------------------------FUNÇÕES COMPARATIVAS-----------------------
 * ====================================================================
 */

/**
 * Operação CME - Comparar menor.
 */
function cme() {
    if (memory[s - 1] < memory[s]) {
        memory[s - 1] = 1;
    } else {
        memory[s - 1] = 0;
    }
    s = s - 1;
}

/**
 * Operação CMA - Comparar maior.
 */
function cma() {
    if (memory[s - 1] > memory[s]) {
        memory[s - 1] = 1;
    } else {
        memory[s - 1] = 0;
    }
    s = s - 1;
}

/**
 * Operação CEQ - Comparar igual.
 */
function ceq() {
    if (memory[s - 1] == memory[s]) {
        memory[s - 1] = 1;
    } else {
        memory[s - 1] = 0;
    }
    s = s - 1;
}

/**
 * Operação CDIF - Comparar Desigual.
 */
function cdif() {
    if (memory[s - 1] != memory[s]) {
        memory[s - 1] = 1;
    } else {
        memory[s - 1] = 0;
    }
    s = s - 1;
}

/**
 * Operação CMEQ - Comparar menor ou igual.
 */
function cmeq() {
    if (memory[s - 1] <= memory[s]) {
        memory[s - 1] = 1;
    } else {
        memory[s - 1] = 0;
    }
    s = s - 1;
}

/**
 * Operação CMAQ - Comparar maior ou igual.
 */
function cmaq() {
    if (memory[s - 1] >= memory[s]) {
        memory[s - 1] = 1;
    } else {
        memory[s - 1] = 0;
    }
    s = s - 1;
}

/**
 * ====================================================================
 * -------------------------FUNÇÕES DE MEMORIA-------------------------
 * ====================================================================
 */

/**
 * Operação LDC - Carregar constante.
 */
function ldc() {
    s = s + 1;
    memory[s] = instructions[i].parameters.p1;
}

/**
 * Operação LDV - Carregar valor.
 */
function ldv() {
    s = s + 1;
    memory[s] = memory[instructions[i].parameters.p1];
}

/**
 * Operação STR - Armazena valor.
 */
function str() {
    memory[instructions[i].parameters.p1] = memory[s];
    s = s - 1;
}

/**
 * Operação ALLOC - Aloca memória.
 */
function alloc() {
    for (let k = 0; k < instructions[i].parameters.p2; k++) {
        s = s + 1;
        memory[s] = memory[instructions[i].parameters.p1 + k];
    }
}

/**
 * Operação DALLOC - Desaloca memória.
 */
function dalloc() {
    // //console.log(instructions[i].parameters.p2);
    for (let k = instructions[i].parameters.p2 - 1; k >= 0; k--) {

        memory[instructions[i].parameters.p1 + k] = memory[s];
        s = s - 1;
    }
}

/**
 * ====================================================================
 * -------------------------FUNÇÕES DE DESVIO--------------------------
 * ====================================================================
 */

/**
 * Operação JMP - Desvia para uma posição de memoria.
 */
function jmp() {
    i = findLabel(instructions[i].parameters.p1).index;
}

/**
 * Operação JMPF - Desvia para uma posição de memoria caso seja falso.
 */
function jmpf() {
    if (memory[s] == 0) {
        i = findLabel(instructions[i].parameters.p1).index;
        // Decrementa pois será incrementado na main.
        i = i - 1;
        //i = i + 1;
    } else {
        // Não faz nada pois será incrementado na main
        // i = i - 1;
    }
    s = s - 1;
}

/**
 * Operação CALL - Chama procedimento ou funcao
 */
function call() {
    s = s + 1;
    memory[s] = i + 1;
    i = findLabel(instructions[i].parameters.p1).index;
}

/**
 * Operação RETURN - Returna a posicao de chamada da funcao ou procedimento.
 */
function ret() {
    i = memory[s];
    s = s - 1;
}

/**
 * Operação RETURNF - Ultimo valor entrado pelo usuario.
 */
function retf() {
    if (instructions[i].parameters.p2 != 0) {
        let retorno = s;
        s--;
        dalloc();
        s++;
        memory[s] = memory[s - 1];
        memory[s - 1] = memory[retorno];
    } else {
        dalloc();
        if (instructions[i].parameters.p2 != 1) {
            let aux = memory[s];
            memory[s] = memory[s - 1];
            memory[s - 1] = aux;
        }
    }


    ret();

}

/**
 * ====================================================================
 * -------------------------FUNÇÕES DE SISTEMA--------------------------
 * ====================================================================
 */

/**
 * Operação START - Inicia rotina.
 */
function start() {
    s = -1;
    document.getElementById("terminal").innerHTML = "> ";
}
/**
 * Operação HLT - Para execução da maquina virtual.
 */
function hlt() {
    exec = false;
    debug.executando = false;
    // //console.log('Fim - hlt');
    // //console.log('executando: ' + debug.executando);
    // //console.log('exec: ' + exec);

}

/**
 * Funções de entrada de valor e impressão de valor.
 * Necessita de desenvolvimento, pois envolve o electrons
 */

/**
 * Operação RD - Ultimo valor entrado pelo usuario.
 */
function rd() {
    entryValue = readEntry();
    s = s + 1;
    memory[s] = entryValue;
}

/**
 * Operação PRN - Imprime ultimo valor.
 */
function prn() {
    // printValue(memory[s]);
    if (memory[s] == undefined) {
        document.getElementById("terminal").innerHTML += templateTerminal("");
    } else {
        document.getElementById("terminal").innerHTML += templateTerminal(memory[s]);
    }
    s = s - 1;
}

/**
 * ====================================================================
 * -------------------------FUNÇÕES DE CONTROLE------------------------
 * ====================================================================
 */

//find Label retorna o objeto retornado e não a posição
function findLabel(label) {
    let pos = instructions.find(function (item, index) {
        if (item.label === label) {
            return index;
        }
    });
    return pos;
}

//Função para controlar debug;
function debugControl() {
    debug.valueCheckBox = !debug.valueCheckBox;
    if (!debug.valueCheckBox) {
        document.getElementById("btn-debug").classList.remove("text-warning");
        document.getElementById("btn-debug").classList.add("text-secondary");
    } else {
        document.getElementById("btn-debug").classList.remove("text-secondary");
        document.getElementById("btn-debug").classList.add("text-warning");
    }
    //alert("Modo Debug " + (debug.valueCheckBox ? 'Ativado!' : 'Desativado!'));
}

function checkAll() {
    if (document.getElementById("checkbox_all").checked == true) {
        document.getElementById("btn-check").classList.remove("text-secondary");
        document.getElementById("btn-check").classList.add("text-danger");
        for (let i = 0; i < instructions.length; i++) {
            document.getElementById("checkbox_" + i).checked = true;
        }
    } else {
        document.getElementById("btn-check").classList.remove("text-danger");
        document.getElementById("btn-check").classList.add("text-secondary");
        for (let i = 0; i < instructions.length; i++) {
            document.getElementById("checkbox_" + i).checked = false;
        }
    }
}

/**
 * ====================================================================
 * -------------------------TEMPLATES----------------------------------
 * ====================================================================
 */
//Template para inserção da instrução no front
function templateItemInstrução(instrucao, num) {
    // //console.log(instrucao.op);
    // //console.log(num);
    return `
    <tr>
        <td>
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="checkbox_${num}">
            </div>
        </td>
        <th scope="row">${num}</th>
        <td>${instrucao}</td>
    </tr>
    `
}

function attMemoria() {
    document.getElementById("tabelaMemoria").innerHTML = "";

    for (let pos = 0; pos <= s; pos++) {
        if (memory[pos] == undefined) {
            document.getElementById("tabelaMemoria").innerHTML += templateItemMemoria(pos, "");
        } else {
            document.getElementById("tabelaMemoria").innerHTML += templateItemMemoria(pos, memory[pos]);
        }

    }

}

function templateItemMemoria(pos, valor) {
    return `
    <li>
        [${pos}] -> ${valor}
    </li>
    `
}

function templateTerminal(valor) {
    return `
        ${valor} <br>
        &nbsp;&ensp;
    `
}