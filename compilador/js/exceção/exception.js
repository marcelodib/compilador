/**
 * ====================================================================
 * -------------------------VARIAVEIS GLOBAIS--------------------------
 * ====================================================================
 */

/**
 * JSON para controle de exception:
 *   line: linha em que ocorreu o erro,
 *   position: posição na linha que ocorreu o erro,
 *   lexema: lexema que ocorreu o erro
 */
export let exceptionJSON = [];
/**
 * ====================================================================
 * ------------------------------EXECUÇÃO------------------------------
 * ====================================================================
 */

/**
 * Constroi a mensagem de exceção.
 * @param {*} error JSON
 *  Possui chaves:
 *   - line : Linha da onde ocorreu o erro.
 *   - simbol: Simbolo no qual ocorreu o erro.
 *   - position: Posicao na linha em que ocorreu o erro .
 *   - tipo: Indentifica se o erro é lexico, sintatico ou semantico.
 *   - esperado: Array com todos os lexemas esperados.
 */
export function buildException(error) {
  let msg;
  if (error.lexema == undefined) {
    msg = "Linha " + error.line + ".<br>";
  } else if (error.tipo != undefined) {
    msg = "Linha " + error.line + ": Foi encontrado um erro proximo de '" + error.lexema + "'.<br>";
  } else {
    msg = "Linha " + error.line + ": Foi encontrado um erro na posição " + error.position + " proximo de '" + error.lexema + "'.<br>";
  }

  if (error.esperado != undefined) {
    if (error.esperado.length > 1) {
      msg += "Esperados:"
      error.esperado.forEach(expect => {
        msg += "<br>&ensp;&ensp;&ensp;&ensp;" + expect;
      })
    } else if (error.esperado.length == 1) {
      msg += "Esperado: " + error.esperado[0];
    }
  }

  return msg;
}

export function limpaException() {
  exceptionJSON = [];
}