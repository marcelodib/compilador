/**
 * ====================================================================
 * ------------------------------IMPORT--------------------------------
 * ====================================================================
 */
import * as simbolTable from './simbolTable.js';
import * as codeGenerator from './codeGen.js';
import * as exception from '../exceção/exception.js';

/**
 * ====================================================================
 * ====================================================================
 */
/*Array de lexemas */
let postfix = [];
/*Array temporario de lexemas*/
let postfixStack = [];
let postfixTier = [{
        operators: ["+$", "-$", "nao"],
        tier: 7
    },
    {
        operators: ["*", 'div'],
        tier: 6
    },
    {
        operators: ["+", '-'],
        tier: 5
    },
    {
        operators: ['>', '<', '<=', '>=', '=', '!='],
        tier: 4
    },
    {
        operators: ['e'],
        tier: 3
    },
    {
        operators: ['ou'],
        tier: 2
    },
    {
        operators: ['(', ')'],
        tier: 1
    }
];
let postfixAssembly = {
    "*": "MULT",
    "div": "DIVI",
    "+": "ADD",
    "-": "SUB",
    ">": "CMA",
    "<": "CME",
    "<=": "CMEQ",
    ">=": "CMAQ",
    "=": "CEQ",
    "!=": "CDIF",
    "e": "AND",
    "ou": "OR",
    "nao": "NEG",
    "-$": "INV",
}

/**
 * ====================================================================
 * ------------------------------EXECUÇÃO------------------------------
 * ====================================================================
 */
export function postfixGenerator(token) {
    switch (token.simbol) {
        case 'Sidentificador':
            postfix.push(token.lexema);
            break;
        case 'Snumero':
            postfix.push(token.lexema);
            break;
        case 'Sverdadeiro':
            postfix.push(token.lexema);
            break;
        case 'Sfalso':
            postfix.push(token.lexema);
            break;
        default:
            stack(token.lexema);
            break;
    }
    // //console.log(postfix);
    // //console.log(JSON.stringify(postfixStack));
}


export function clearStack() {
    for (let i = postfixStack.length - 1; i >= 0; i--) {
        postfix.push(postfixStack.pop().operator);
    }
    // if (postfix.length == 1) {
    //     //console.log(postfix);
    //     if (postfix[0] != 'verdadeiro' && postfix[0] != 'falso' && isNaN(postfix[0])) {
    //         postfixCodeGenerator(simbolTable.searchTypeVarFunc(postfix[0]));
    //     } else {
    //         postfixCodeGenerator({
    //             lexema: postfix[0]
    //         });
    //     }
    // }
}

export function clearPostfix() {
    postfix = [];
}

function stack(operator) {
    const operatorTier = findTier(operator);
    if (operator != '(') {
        popStack({
            operator: operator,
            tier: operatorTier
        });
    }
    if (operator != ')') {
        postfixStack.push({
            operator: operator,
            tier: operatorTier
        });
    }
}

function popStack(item) {
    for (let i = postfixStack.length - 1; i >= 0; i--) {
        if (postfixStack[i].tier >= item.tier && postfixStack[i].operator != "(") {
            postfix.push(postfixStack.pop().operator);
        } else if (postfixStack[i].operator == "(") {
            if (item.operator == ')') {
                postfixStack.pop();
            }
            break;
        }
    }
}

function findTier(operator) {
    let item = postfixTier.find(function (item) {
        // //console.log(item);
        if (item.operators.includes(operator)) {
            return item.tier;
        }
    });
    if (item == undefined) {
        return 0;
    }
    return item.tier;
}

export function evalueExpression(line) {
    let item = [];
    console.log("=================================");
    console.log(postfix);
    console.log("=================================");
    postfix.forEach(function (operator) {
        let tier = 0;
        tier = findTier(operator);

        switch (tier) {
            case 2:
                //console.log(JSON.stringify(item));
                if (item[item.length - 1].type == item[item.length - 2].type && item[item.length - 2].type == "booleano") {
                    // postfixCodeGenerator(item[item.length - 2]);
                    // postfixCodeGenerator(item[item.length - 1]);
                    codeGenerator.generate(postfixAssembly[operator], '', '');
                    //console.log("Entrei 2");
                    item.pop();
                    item.pop();
                    item.push({
                        type: "booleano",
                        stack: true
                    });
                } else {
                    throw pushException(line, item[item.length - 1].lexema, ["Operando do tipo booleano"]);
                }
                break;
            case 3:
                //console.log(JSON.stringify(item));
                if (item[item.length - 1].type == item[item.length - 2].type && item[item.length - 2].type == "booleano") {
                    // postfixCodeGenerator(item[item.length - 2]);
                    // postfixCodeGenerator(item[item.length - 1]);
                    codeGenerator.generate(postfixAssembly[operator], '', '');
                    //console.log("Entrei 3");
                    item.pop();
                    item.pop();
                    item.push({
                        type: "booleano",
                        stack: true
                    });
                } else {
                    throw pushException(line, item[item.length - 1].lexema, ["Operando do tipo booleano"]);
                }
                break;
            case 4:
                //console.log(JSON.stringify(item));
                if (item[item.length - 1].type == item[item.length - 2].type && item[item.length - 2].type == "inteiro") {
                    // postfixCodeGenerator(item[item.length - 2]);
                    // postfixCodeGenerator(item[item.length - 1]);
                    codeGenerator.generate(postfixAssembly[operator], '', '');
                    //console.log("Entrei 4");
                    item.pop();
                    item.pop();
                    item.push({
                        type: "booleano",
                        stack: true
                    });
                } else {
                    throw pushException(line, item[item.length - 1].lexema, ["Operando do tipo inteiro"]);
                }
                break;
            case 5:
                //console.log(JSON.stringify(item));
                if (item[item.length - 1].type == item[item.length - 2].type && item[item.length - 2].type == "inteiro") {
                    // postfixCodeGenerator(item[item.length - 2]);
                    // postfixCodeGenerator(item[item.length - 1]);
                    codeGenerator.generate(postfixAssembly[operator], '', '');
                    //console.log("entrei 5");
                    item.pop();
                    item.pop();
                    item.push({
                        type: "inteiro",
                        stack: true
                    });
                } else {
                    throw pushException(line, item[item.length - 1].lexema, ["Operando do tipo inteiro"]);
                }
                break;
            case 6:
                //console.log(JSON.stringify(item));
                if (item[item.length - 1].type == item[item.length - 2].type && item[item.length - 2].type == "inteiro") {
                    // postfixCodeGenerator(item[item.length - 2]);
                    // postfixCodeGenerator(item[item.length - 1]);
                    codeGenerator.generate(postfixAssembly[operator], '', '');
                    //console.log("entrei 6");
                    item.pop();
                    item.pop();
                    item.push({
                        type: "inteiro",
                        stack: true
                    });
                } else {
                    throw pushException(line, item[item.length - 1].lexema, ["Operando do tipo inteiro"]);
                }
                break;
            case 7:
                //console.log(JSON.stringify(item));
                if (item[item.length - 1].type == "inteiro" && (operator == "-$" || operator == "+$")) {
                    //console.log("entrei 7 inteiro");
                    if (operator != "+$") {
                        codeGenerator.generate(postfixAssembly[operator], '', '');
                    }
                } else if (item[item.length - 1].type == "booleano" && operator == "nao") {
                    //console.log("entrei 7 booleano");
                    codeGenerator.generate(postfixAssembly[operator], '', '');
                } else {
                    throw pushException(line, item[item.length - 1].lexema, ["Operando do tipo inteiro para '+' ou '-' unitário e booleano para 'nao'"]);
                }
                break;
            default:
                let simbol;
                if (isNaN(operator) && operator != "verdadeiro" && operator != "falso") {
                    simbol = simbolTable.searchTypeVarFunc(operator);
                } else {
                    //console.log(operator);

                    //console.log(isNaN(operator));
                    if (isNaN(operator)) {
                        simbol = {
                            type: "booleano",
                            lexema: operator
                        };
                    } else {
                        //console.log("entrei");
                        simbol = {
                            type: "inteiro",
                            lexema: operator
                        };

                    }
                }
                if (simbol == undefined) {
                    throw pushException(line, simbol.lexema, ["Operando Valido"]);
                } else {
                    postfixCodeGenerator(simbol);
                    item.push(simbol);
                    break;
                }
        }
    });
    //console.log(JSON.stringify(item));
    if (item.length == 1) {
        return item[0].type;
    }
    return false;

}

// function postfixCodeGenerator(operator, item) {
function postfixCodeGenerator(item) {
    if (item.stack == undefined) {
        //console.log(item)
        if (!isNaN(Number(item.lexema))) {
            codeGenerator.generate('LDC', `${item.lexema}`, '');
        } else {
            if (item.lexema == "verdadeiro") {
                codeGenerator.generate('LDC', '1', '');
            } else if (item.lexema == "falso") {
                codeGenerator.generate('LDC', '0', '');
            } else if (item.id == "func") {
                codeGenerator.generate('CALL', `${item.label}`, '');
            } else {
                codeGenerator.generate('LDV', item.memory.toString(), '');
            }
        }

    }

}

/**
 * =====================================================================================
 *                              FAZER ERRO CONDIZENTE
 * =====================================================================================
 */
function pushException(line, lexema, expected) {
    exception.exceptionJSON.push({
        line: line,
        lexema: lexema,
        tipo: "Posfix",
        esperado: expected
    })
}