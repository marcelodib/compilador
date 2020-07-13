/**
 * ====================================================================
 * -------------------------VARIAVEIS GLOBAIS--------------------------
 * ====================================================================
 */


/**
 * ====================================================================
 * -------------------------IMPORT-------------------------------------
 * ====================================================================
 */
import * as exception from '../exceção/exception.js';
import * as main from '../main.js';
import * as token from './token.js';



/**
 * ====================================================================
 * ------------------------------EXECUÇÃO------------------------------
 * ====================================================================
 */

export function lexico(program) {
    let comment = false;
    let lexema = "";
    let simbol = "";
    let reserved = "";
    let reserved2;
    let pos = 0;
    let index = 0;
    // Loop para cada linha do programa
    for (index = 0; index < program.length; index++) {
        // Variável auxiliar
        let line = program[index];
        // Percorre a linha
        for (pos = 0; pos < line.length; pos++) {
            // Caso seja comentário
            if (comment) {
                // Verifica se é o final do comentário
                if (line[pos] == "}") {
                    // Acabou comentário
                    comment = false;
                }
            } // Caso não esteja comentário
            else {
                //Trata Comentário e Consome espaços
                if (line[pos] == "{" || line[pos] == " " || line[pos] == '\t') {
                    // Verifica se é início de comentário
                    if (line[pos] == "{") {
                        comment = true;
                    }
                } else {
                    // Verifica se é alpha (identificador ou palavra reservada)
                    if (isAlpha(line[pos])) {
                        lexema += line[pos];
                        simbol = "Sidentificador";
                        // Verifica proximo para adiantar
                        if ((pos + 1) <= line.length) {
                            // Caso o próximo não seja mais identificador
                            if (!(isAlpha(line[pos + 1]) || !isNaN(line[pos + 1]) || line[pos + 1] == "_") || line[pos + 1] == " ") {
                                // Verifica se é palavra reservada
                                if (reserved = isReserved(lexema)) {
                                    simbol = reserved;
                                }
                                // Coloca na tabela tokens
                                main.tokens.push({
                                    lexema: lexema,
                                    simbol: simbol,
                                    line: index + 1,
                                    position: pos + 1
                                });
                                simbol = "";
                                lexema = "";
                                reserved = "";
                            }
                        } else { // Caso o tenha lido o último da linha
                            // Coloca na tebela tokens
                            main.tokens.push({
                                lexema: lexema,
                                simbol: simbol,
                                line: index + 1,
                                position: pos + 1
                            });
                            simbol = "";
                            lexema = "";
                        }
                    } else if (!isNaN(line[pos])) { // Caso seja um número

                        if ((simbol == "" || simbol == "Snumero")) {
                            lexema += line[pos];
                            simbol = "Snumero";
                            if (line[pos + 1] != undefined) {
                                if (isNaN(line[pos + 1]) || line[pos + 1] == " ") {
                                    main.tokens.push({
                                        lexema: lexema,
                                        simbol: simbol,
                                        line: index + 1,
                                        position: pos + 1
                                    });
                                    simbol = "";
                                    lexema = "";
                                }
                            } else {
                                main.tokens.push({
                                    lexema: lexema,
                                    simbol: simbol,
                                    line: index + 1,
                                    position: pos + 1
                                });
                                simbol = "";
                                lexema = "";
                            }
                        } else if (simbol == "Sidentificador") {
                            lexema += line[pos];
                            if ((pos + 1) < line.length) {
                                if (line[pos + 1] == " ") {
                                    main.tokens.push({
                                        lexema: lexema,
                                        simbol: simbol,
                                        line: index + 1,
                                        position: pos + 1
                                    });
                                    simbol = "";
                                    lexema = "";
                                    //Verifica se continuará sendo um identificador
                                } else if (!(isAlpha(line[pos + 1]) || !isNaN(line[pos + 1]))) {
                                    main.tokens.push({
                                        lexema: lexema,
                                        simbol: simbol,
                                        line: index + 1,
                                        position: pos + 1
                                    });
                                    simbol = "";
                                    lexema = "";
                                }
                            } else {
                                main.tokens.push({
                                    lexema: lexema,
                                    simbol: simbol,
                                    line: index + 1,
                                    position: pos + 1
                                });
                                simbol = "";
                                lexema = "";
                            }
                        }
                    } else {
                        reserved = isReserved(line[pos]);


                        if ((pos + 1) <= line.length) {
                            reserved2 = isReserved(line[pos] + line[pos + 1]);
                        }
                        if (reserved2) {
                            main.tokens.push({
                                lexema: line[pos] + line[pos + 1],
                                simbol: reserved2,
                                line: index + 1,
                                position: pos + 1
                            });
                            pos++;
                            simbol = "";
                            lexema = "";
                        } else if (reserved) {
                            main.tokens.push({
                                lexema: line[pos],
                                simbol: reserved,
                                line: index + 1,
                                position: pos + 1
                            });
                            simbol = "";
                            lexema = "";
                        } else {
                            exception.exceptionJSON.push({
                                line: index + 1,
                                position: pos + 1,
                                lexema: line[pos],
                                tipo: "Lexico"
                            })
                        }
                    }
                    //Pega Token
                    //Coloca Token na Lista de Tokens 
                }
            }
        }
    }
}

let isAlpha = function (ch) {
    return /^[A-Z]$/i.test(ch);
}

let isReserved = function (lexema) {
    if (token.tabelaTokens.hasOwnProperty(lexema)) {
        return token.tabelaTokens[lexema];
    }
    return false;
}