/**
 * ====================================================================
 * -------------------------VARIAVEIS GLOBAIS--------------------------
 * ====================================================================
 */

export let returnStack = [];
export let level = 0;


/**
 * ====================================================================
 * ------------------------------EXECUÇÃO------------------------------
 * ====================================================================
 */

export function setLevel (value) {
    level = level + value;
}

export function levelAnalizer() {
    let result = true;
    let auxReturn = false;
    for (let i = returnStack.length - 1; i > 0; i--) {
        if (returnStack[i].level == level) {
            if (returnStack[i].isIf) {
                result = result && returnStack[i].return;
                returnStack.pop()
            } else {
                auxReturn = auxReturn || returnStack[i].return;
                returnStack.pop()
            }
        }
    }
    result = result || auxReturn;
    if (returnStack.length > 0) {
        if (returnStack[returnStack.length - 1].return == null) {
            returnStack[returnStack.length - 1].return = result;
        }
    } else {
        returnStack.push({
            level: 0,
            return: true
        });
    }
}


export function checkReturn() {
    console.log("checkReturn");
    
    console.log(level);
    console.log(JSON.stringify(returnStack));
    console.log("==================");

    let result = false;

    for (let i = returnStack.length - 1; i >= 0; i--) {
        if (returnStack[i].level == level) {
            result = result || returnStack[i].return;
            returnStack.pop();
        }
    }
    console.log("checkReturn fim");
    
    console.log("result:" + result);
    console.log(JSON.stringify(returnStack));
    console.log("==================");
    return result;
}

export function clearReturn() {
    returnStack = [];
    level = 0;
}