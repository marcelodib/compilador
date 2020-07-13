/**
 * ====================================================================
 * ------------------------------IMPORT--------------------------------
 * ====================================================================
 */
import * as main from '../main.js';
import * as exception from '../exceção/exception.js';
import * as postFix from '../semantico/postFix.js';
import * as simbolTable from '../semantico/simbolTable.js';
import * as codeGen from '../semantico/codeGen.js';
import * as freturn from '../semantico/functionReturn.js';

/**
 * ====================================================================
 * -------------------------VARIAVEIS GLOBAIS--------------------------
 * ====================================================================
 */
let index = -1;
let token;
let tokens = [];
let level = 0;
let label = 0;
let memory = 0;

/**
 * ====================================================================
 * ------------------------------EXECUÇÃO------------------------------
 * ====================================================================
 */
export function sintatico() {
    tokens = main.tokens;
    index = -1;
    level = 0;
    label = 1;
    getToken();
    try {
        if (token.simbol == "Sprograma") {
            getToken();
            if (token.simbol == "Sidentificador") {
                simbolTable.insertTable({
                    lexema: token.lexema,
                    id: "nomePrograma",
                    level: level
                })
                codeGen.generate('START', '', '');
                getToken();
                if (token.simbol == "Sponto_virgula") {
                    analisa_bloco();
                    if (token.simbol == "Sponto") {
                        if (index + 1 == tokens.length) {
                            codeGen.generate('HLT', '', '');
                            ////console.log(main.codeGen);
                            if (exception.exceptionJSON.length != 0) {
                                throw exception.exceptionJSON;
                            }
                        } else {
                            pushException(token.line, token.lexema, token.position);
                            throw exception.exceptionJSON;
                        }
                    } else {
                        pushException(token.line, token.lexema, token.position, ["."]);
                        throw exception.exceptionJSON;
                    }
                } else {
                    pushException(token.line, token.lexema, token.position, [";"]);
                    throw exception.exceptionJSON;
                }
            } else {
                pushException(token.line, token.lexema, token.position, ["identificador"]);
                throw exception.exceptionJSON;
            }
        } else {
            pushException(token.line, token.lexema, token.position, ["programa"]);
            throw exception.exceptionJSON;
        }
    } catch (error) {
        console.log(error);
        /**
         * Ordena erros lexico sintatico semantico
         */
        exception.exceptionJSON.sort(compareLine);

        throw exception.buildException(exception.exceptionJSON.shift());

    }
}

function compareLine(a, b) {
    if (a.line < b.line) {
        return -1;
    }
    if (a.line > b.line) {
        return 1;
    }
    if (a.line = b.line) {
        if (a.position < b.position) {
            return -1;
        }
        if (a.position > b.position) {
            return 1;
        }
    }
    return 0;
}


function analisa_bloco(isFunc = false) {
    let countVars = 0;
    let localMemory = 0;
    getToken();
    countVars = analisa_et_variaveis(countVars);
    codeGen.generate('ALLOC', `${memory}`, `${countVars}`);
    localMemory = memory;
    memory += countVars;
    if (isFunc) {
        isFunc.countVars = countVars;
        isFunc.localMemory = localMemory;
    }
    analisa_subrotinas();
    analisa_comandos(isFunc);
    if (!isFunc) {
        codeGen.generate('DALLOC', `${localMemory}`, `${countVars}`);
    }
    memory -= countVars;
}

function analisa_et_variaveis(countVars) {
    if (token.simbol == "Svar") {
        getToken();
        if (token.simbol == "Sidentificador") {
            while (token.simbol == "Sidentificador") {
                countVars = analisa_variaveis(countVars);
                if (token.simbol == "Sponto_virgula") {
                    getToken();
                } else {
                    pushException(token.line, token.lexema, token.position, [";"]);
                    throw exception.exceptionJSON;
                }
            }
        } else {
            pushException(token.line, token.lexema, token.position, ["identificador"]);
            throw exception.exceptionJSON;
        }
    } else {
        return countVars;
    }
    return countVars;
}

function analisa_subrotinas() {
    let auxlabel;
    let flag = 0;

    if (token.simbol == "Sprocedimento" || token.simbol == "Sfuncao") {
        auxlabel = label;
        codeGen.generate('JMP', `${label}`, ''); // Pula execucao do procedimento
        label++;
        flag = 1;
    }
    while (token.simbol == "Sprocedimento" || token.simbol == "Sfuncao") {
        if (token.simbol == "Sprocedimento") {
            analisa_declaracao_procedimento();
        } else {
            analisa_declaracao_funcao();
        }
        if (token.simbol == "Sponto_virgula") {
            getToken();
        } else {
            pushException(token.line, token.lexema, token.position, [";"]);
            throw exception.exceptionJSON;
        }
    }
    if (flag == 1) {
        codeGen.generate(`${auxlabel}`, 'NULL', ''); // Inicio do programa principal
    }
}

function analisa_variaveis(countVars) {
    do {
        if (token.simbol == "Sidentificador") {
            if (!simbolTable.isDuplicate(token.lexema, level) && !simbolTable.searchFunc(token.lexema) && !simbolTable.searchProc(token.lexema) && !simbolTable.isProgram(token.lexema)) {
                simbolTable.insertTable({
                    lexema: token.lexema,
                    id: "var",
                    level: level,
                    type: "",
                    memory: memory + countVars
                });
                countVars++;
                getToken();
                if (token.simbol == "Svirgula" || token.simbol == "Sdoispontos") {
                    if (token.simbol == "Svirgula") {
                        getToken();
                        if (token.simbol == "Sdoispontos") {
                            pushException(token.line, token.lexema, token.position, [":"]);
                            throw exception.exceptionJSON;
                        }
                    }
                } else {
                    pushException(token.line, token.lexema, token.position, [",", ":"]);
                    throw exception.exceptionJSON;
                }
            } else {
                pushException(token.line, token.lexema, token.position, ["identificador não utilizado"]);
                throw exception.exceptionJSON;
            }
        } else {
            pushException(token.line, token.lexema, token.position, ["identificador"]);
            throw exception.exceptionJSON;
        }
    } while (token.simbol != "Sdoispontos");
    getToken();
    analisa_tipo();
    return countVars;
}

function analisa_tipo() {
    if (token.simbol != "Sinteiro" && token.simbol != "Sbooleano") {
        pushException(token.line, token.lexema, token.position, ["inteiro", "booleano"]);
        throw exception.exceptionJSON;
    } else {
        simbolTable.insertVarType(token.lexema);
    }
    getToken();
}

function analisa_comandos(isFunc = false, isIf = false, isWhile = false) {
    let ret = false;
    let auxRet = false;
    ////console.log(token);

    if (token.simbol == "Sinicio") {
        getToken();
        auxRet = analisa_comando_simples(isFunc, isIf, isWhile);
        if (auxRet == true) {
            ret = auxRet;
        }
        while (token.simbol != "Sfim") {
            if (token.simbol == "Sponto_virgula") {
                getToken();
                if (token.simbol != "Sfim") {
                    auxRet = analisa_comando_simples(isFunc, isIf, isWhile);
                    if (auxRet == true) {
                        ret = auxRet;
                    }
                }
            } else {
                pushException(token.line, token.lexema, token.position, [";"]);
                throw exception.exceptionJSON;
            }
        }
        getToken();
        return ret;
    } else {
        pushException(token.line, token.lexema, token.position, ["inicio"]);
        throw exception.exceptionJSON;
    }
}

function analisa_comando_simples(isFunc = false, isIf = false, isWhile = false) {
    if (token.simbol == "Sidentificador") {
        analisa_atrib_chprocedimento(isFunc, isIf, isWhile);
    } else if (token.simbol == "Sse") {
        // console.log(freturn.level);

        // INC
        if (isFunc) {
            freturn.setLevel(1)
        }
        analisa_se(isFunc, isWhile);
        //console.log(freturn.returnStack);
    } else if (token.simbol == "Senquanto") {
        analisa_enquanto(isFunc);
    } else if (token.simbol == "Sleia") {
        analisa_leia();
    } else if (token.simbol == "Sescreva") {
        // console.log("ENTROU");

        analisa_escreva();
    } else {
        analisa_comandos(isFunc, isIf, isWhile);
        // if (isIf) {
        //     freturn.levelAnalizer();
        // }
    }
}

function analisa_atrib_chprocedimento(isFunc = false, isIf = false, isWhile = false) {
    let checkAttr;
    let returnFlag = 0;
    if (tokens[index + 1].simbol == "Satribuicao") {
        checkAttr = token;
        if (isFunc) {
            if (isFunc.lexema == token.lexema) {
                //console.log("===========entrei retorno==============");
                if(!isWhile) {
                    freturn.returnStack.push({
                        level: freturn.level,
                        return: true
                    });
                }
                returnFlag = 1;
            }
        } else {
            if (!simbolTable.searchVar(token.lexema)) {
                pushException(token.line, token.lexema, token.position, ["variável"]);
                throw exception.exceptionJSON;
            }
        }
        getToken();
        analisa_atribuicao(checkAttr, isFunc);
        if (returnFlag) {
            codeGen.generate('RETURNF', `${isFunc.localMemory}`, `${isFunc.countVars}`);
        }
    } else {
        analisa_chamada_procedimento();
    }
}


function analisa_se(isFunc = false, isWhile = false) {
    let auxLabel1, auxlabel2;
    getToken();
    analisa_expressao();
    postFix.clearStack();
    ////console.log(token);
    const returnExpression = postFix.evalueExpression(token.line - 1);
    if (returnExpression == "booleano") {
        postFix.clearPostfix();
        auxLabel1 = label;
        label++;
        if (token.simbol == "Sentao") {
            codeGen.generate('JMPF', `${auxLabel1}`, '');

            getToken();

            analisa_comando_simples(isFunc, true, isWhile);

            let entao = false;

            if(!isWhile){
                entao = freturn.checkReturn();
            }

            if (token.simbol == "Ssenao") {

                //console.log(freturn.returnStack);

                auxlabel2 = label;
                label++;
                codeGen.generate('JMP', `${auxlabel2}`, '');
                codeGen.generate(`${auxLabel1}`, 'NULL', '');
                getToken();
                analisa_comando_simples(isFunc, true, isWhile);

                if(!isWhile) {
                    let senao = freturn.checkReturn();

                    if (isFunc) {
                        freturn.setLevel(-1)
                    }
                    // DEC

                    freturn.returnStack.push({
                        level: freturn.level,
                        return: entao && senao
                    });
                }

                ////console.log(token);
                codeGen.generate(`${auxlabel2}`, 'NULL', '');
            } else {
                if (isFunc) {
                    freturn.setLevel(-1)
                }
                codeGen.generate(`${auxLabel1}`, 'NULL', '');
            }
        } else {
            pushException(token.line, token.lexema, token.position, ["entao"]);
            throw exception.exceptionJSON;
        }
    } else {
        pushException(token.line, token.lexema, token.position, ["Retorno de expressão do tipo booleano"]);
        throw exception.exceptionJSON;
    }
}

function analisa_enquanto(isFunc = false) {
    let auxlabel1, auxlabel2;
    auxlabel1 = label;
    label++;
    getToken();
    codeGen.generate(`${auxlabel1}`, 'NULL', '');
    analisa_expressao();
    postFix.clearStack();
    ////console.log(token);
    const returnExpression = postFix.evalueExpression(token.line - 1);
    if (returnExpression == "booleano") {
        postFix.clearPostfix();
        if (token.simbol == "Sfaca") {
            auxlabel2 = label
            label++;
            codeGen.generate('JMPF', `${auxlabel2}`, '');
            getToken();
            analisa_comando_simples(isFunc, false, true);
            codeGen.generate('JMP', `${auxlabel1}`, '');
            codeGen.generate(`${auxlabel2}`, 'NULL', '');
        } else {
            pushException(token.line, token.lexema, token.position, ["faca"]);
            throw exception.exceptionJSON;
        }
    } else {
        pushException(token.line, token.lexema, token.position, ["Retorno de expressão do tipo booleano"]);
        throw exception.exceptionJSON;
    }
}

function analisa_expressao() {
    analisa_expressao_simples();
    if (token.simbol == "Smaior" || token.simbol == "Smaiorig" || token.simbol == "Sig" || token.simbol == "Smenor" || token.simbol == "Smenorig" || token.simbol == "Sdif") {
        postFix.postfixGenerator(token);
        getToken();
        analisa_expressao_simples();
    }
}

function analisa_expressao_simples() {
    if (token.simbol == "Smais" || token.simbol == "Smenos") {
        postFix.postfixGenerator({
            lexema: token.lexema + "$",
            simbol: token.simbol
        });
        getToken();
    }
    analisa_termo();
    while (token.simbol == "Smais" || token.simbol == "Smenos" || token.simbol == "Sou") {
        postFix.postfixGenerator(token);
        getToken();
        analisa_termo();
    }
}

function analisa_termo() {
    analisa_fator();
    while (token.simbol == "Smult" || token.simbol == "Sdiv" || token.simbol == "Se") {
        postFix.postfixGenerator(token);
        getToken();
        analisa_fator();
    }
}

function analisa_fator() {
    if (token.simbol == "Sidentificador") {
        if (!simbolTable.searchVar(token.lexema)) {
            if (simbolTable.searchFunc(token.lexema)) {
                postFix.postfixGenerator(token);
                analisa_chamada_funcao();
            } else {
                pushException(token.line, token.lexema, token.position, ["variável", "função"]);
                throw exception.exceptionJSON;
            }
        } else {
            postFix.postfixGenerator(token);
            getToken();
        }
    } else if (token.simbol == "Snumero") {
        postFix.postfixGenerator(token);
        getToken();
    } else if (token.simbol == "Snao") {
        postFix.postfixGenerator(token);
        getToken();
        analisa_fator();
    } else if (token.simbol == "Sabre_parenteses") {
        postFix.postfixGenerator(token);
        getToken();
        analisa_expressao();
        if (token.simbol == "Sfecha_parenteses") {
            postFix.postfixGenerator(token);
            getToken();
        } else {
            pushException(token.line, token.lexema, token.position, [")"]);
            throw exception.exceptionJSON;
        }
    } else if (token.simbol == "Sverdadeiro" || token.simbol == "Sfalso") {
        postFix.postfixGenerator(token);
        getToken();
    } else {
        pushException(token.line, token.lexema, token.position, ["identificador", "numero", "nao", "abre_parenteses", "verdadeiro", "falso"]);
        throw exception.exceptionJSON;
    }
}

function analisa_leia() {
    getToken();
    if (token.simbol == "Sabre_parenteses") {
        getToken();
        if (token.simbol == "Sidentificador") {
            if (simbolTable.searchVar(token.lexema)) {
                codeGen.generate('RD', '', '');
                let simbol = simbolTable.searchTypeVarFunc(token.lexema);
                codeGen.generate('STR', `${simbol.memory}`, '');
                getToken();
                if (token.simbol == "Sfecha_parenteses") {
                    getToken();
                } else {
                    pushException(token.line, token.lexema, token.position, [")"]);
                    throw exception.exceptionJSON;
                }
            } else {
                pushException(token.line, token.lexema, token.position, ["Alguma Variavel ja declarada!"]);
                throw exception.exceptionJSON;
            }
        } else {
            pushException(token.line, token.lexema, token.position, ["identificador"]);
            throw exception.exceptionJSON;
        }
    } else {
        pushException(token.line, token.lexema, token.position, ["("]);
        throw exception.exceptionJSON;
    }
}

function analisa_escreva() {
    getToken();
    if (token.simbol == "Sabre_parenteses") {
        getToken();
        if (token.simbol == "Sidentificador") {
            if (simbolTable.searchVarFunc(token.lexema)) { // VERIFICAR SE É POSSÍVEL ESCREVER COM O RETORNO DE UMA FUNÇÃO
                let simbol = simbolTable.searchTypeVarFunc(token.lexema);
                if (simbol.id == 'var') {
                    codeGen.generate('LDV', `${simbol.memory}`, '');
                    codeGen.generate('PRN', '', '');
                } else {
                    codeGen.generate('CALL', `${simbol.label}`, '');
                    codeGen.generate('PRN', '', '');
                }

                getToken();
                if (token.simbol == "Sfecha_parenteses") {
                    getToken();
                } else {
                    pushException(token.line, token.lexema, token.position, [")"]);
                    throw exception.exceptionJSON;
                }
            } else {
                pushException(token.line, token.lexema, token.position, ["Alguma Variavel ou Funcao ja declarada!"]);
                throw exception.exceptionJSON;
            }
        } else {
            pushException(token.line, token.lexema, token.position, ["identificador"]);
            throw exception.exceptionJSON;
        }
    } else {
        pushException(token.line, token.lexema, token.position, ["("]);
        throw exception.exceptionJSON;
    }
}

function analisa_atribuicao(attribution, isFunc = false) {
    let returnExpression;
    let returnType;
    getToken();
    analisa_expressao();
    postFix.clearStack();
    ////console.log(token);
    returnExpression = postFix.evalueExpression(token.line);
    returnType = simbolTable.searchTypeVarFunc(attribution.lexema);
    if (returnType.type != returnExpression) {
        pushException(token.line, token.lexema, token.position, ["Expressao com tipo de retorno correto"]);
        throw exception.exceptionJSON;
    }
    // console.log(returnType);
    if (!isFunc || attribution.lexema != isFunc.lexema) {
        codeGen.generate("STR", `${returnType.memory}`, '');
    }
    postFix.clearPostfix();
}

function analisa_chamada_procedimento() {
    let proc;

    if (token.simbol != "Sidentificador") {
        pushException(token.line, token.lexema, token.position, ["identificador"]);
        throw exception.exceptionJSON;
    } else {
        if (simbolTable.searchProc(token.lexema)) {
            proc = simbolTable.searchTypeProc(token.lexema);
            codeGen.generate('CALL', `${proc.label}`, '');
            getToken();
        } else {
            pushException(token.line, token.lexema, token.position, ["Procedimento não declarado!"]);
            throw exception.exceptionJSON;
        }
    }
}

function analisa_chamada_funcao() {
    let func;
    if (token.simbol == "Sidentificador") {
        if (simbolTable.searchFunc(token.lexema)) {
            getToken();
            return;
        } else {
            pushException(token.line, token.lexema, token.position, ["Funcao não declarado!"]);
            throw exception.exceptionJSON;
        }
    } else {
        pushException(token.line, token.lexema, token.position, ["identifcador"]);
        throw exception.exceptionJSON;
    }

}

function analisa_declaracao_procedimento() {
    getToken();
    if (token.simbol == "Sidentificador") {
        if (!simbolTable.searchProc(token.lexema) && !simbolTable.searchFunc(token.lexema) && !simbolTable.searchVar(token.lexema) && !simbolTable.isProgram(token.lexema)) {
            simbolTable.insertTable({
                lexema: token.lexema,
                id: "proc",
                level: level,
                label: label
            });
            level++;
            /*
             * ============================
             * GERAÇAO DE CODIGO
             */
            codeGen.generate(`${label}`, 'NULL', '');
            label++;
            /**
             * ============================
             */
            getToken();
            if (token.simbol == "Sponto_virgula") {
                analisa_bloco();
                codeGen.generate('RETURN', '', '');
            } else {
                pushException(token.line, token.lexema, token.position, [";"]);
                throw exception.exceptionJSON;
            }
        } else {
            pushException(token.line, token.lexema, token.position, ["identificador não declarado"]);
            throw exception.exceptionJSON;
        }
    } else {
        pushException(token.line, token.lexema, token.position, ["identificador"]);
        throw exception.exceptionJSON;
    }
    level--;
    simbolTable.simbolTablePop(level);

}

function analisa_declaracao_funcao() {
    let func;
    getToken();
    if (token.simbol == "Sidentificador") {
        if (!simbolTable.searchFunc(token.lexema) && !simbolTable.searchProc(token.lexema) && !simbolTable.searchVar(token.lexema) && !simbolTable.isProgram(token.lexema)) {
            func = {
                lexema: token.lexema,
                id: "func",
                level: level,
                type: "tipoFuncao",
                label: label
            };
            simbolTable.insertTable(func);

            codeGen.generate(`${label}`, 'NULL', '');
            label++;
            level++;
            getToken();
            if (token.simbol == "Sdoispontos") {
                getToken();
                if (token.simbol == "Sinteiro" || token.simbol == "Sbooleano") {
                    if (token.simbol == "Sinteiro") {
                        main.simbolTable[main.simbolTable.length - 1].type = "inteiro";
                    } else {
                        main.simbolTable[main.simbolTable.length - 1].type = "booleano";
                    }
                    getToken();
                    if (token.simbol == "Sponto_virgula") {
                        analisa_bloco(func);
                        let functionReturn = freturn.checkReturn();
                        // console.log(functionReturn);

                        if (functionReturn) {
                            freturn.clearReturn();
                        } else {
                            pushException(token.line, token.lexema, token.position, ["Retorno de função em todas as possibilidades de execução"]);
                            throw exception.exceptionJSON;
                        }
                    }
                } else {
                    pushException(token.line, token.lexema, token.position, ["inteiro", "booleano"]);
                    throw exception.exceptionJSON;
                }
            } else {
                pushException(token.line, token.lexema, token.position, [":"]);
                throw exception.exceptionJSON;
            }
        } else {
            pushException(token.line, token.lexema, token.position, ["identificador não declarado"]);
            throw exception.exceptionJSON;
        }
    } else {
        pushException(token.line, token.lexema, token.position, ["identificador"]);
        throw exception.exceptionJSON;
    }
    level--;
    simbolTable.simbolTablePop(level);
}

function getToken() {
    // ////console.log(token);

    index++;
    token = tokens[index];
    if (token == undefined) {
        pushException(tokens[index - 1].line, tokens[index - 1].lexema, tokens[index - 1].position);
        throw exception.exceptionJSON;
    }
}

export function pushException(line, lexema, position, expected) {
    exception.exceptionJSON.push({
        line: line,
        position: position,
        lexema: lexema,
        tipo: "Sintatico",
        esperado: expected
    })
}