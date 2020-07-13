import * as main from '../main.js';

/**
 * ====================================================================
 * ------------------------------EXECUÇÃO------------------------------
 * ====================================================================
 */

export function insertTable(item) {
    main.simbolTable.push(item);
}

export function insertVarType(type) {
    for (let i = main.simbolTable.length - 1; i >= 0; i--) {
        if (main.simbolTable[i] == undefined) {
            break;
        }
        if (main.simbolTable[i].type == "" && main.simbolTable[i].id == "var") {
            main.simbolTable[i].type = type;
        }
    }
}

export function isDuplicate(lexema, level) {
    const item = main.simbolTable.find(function (item) {
        if (item.lexema == lexema && item.level == level) {
            return item;
        }
    });
    if (item == undefined) {
        return false;
    } else {
        return true;
    }
}

export function searchVar(lexema) {
    const item = main.simbolTable.find(function (item) {
        if (item.lexema == lexema && item.id == 'var') {
            return item;
        }
    });
    if (item == undefined) {
        return false;
    } else {
        return true;
    }
}

export function searchVarFunc(lexema) {
    const item = main.simbolTable.find(function (item) {
        if (item.lexema == lexema && (item.id == 'var' || item.id == 'func')) {
            return item;
        }
    });
    if (item == undefined) {
        return false;
    } else {
        return true;
    }
}

export function searchProc(lexema) {
    let item = main.simbolTable.find(function (item) {
        if (item.lexema == lexema && item.id == 'proc') {
            return item;
        }
    });
    if (item == undefined) {
        return false;
    } else {
        return true;
    }
}

export function searchFunc(lexema) {
    let item = main.simbolTable.find(function (item) {
        if (item.lexema == lexema && item.id == 'func')
            return item;
    });
    if (item == undefined) {
        return false;
    } else {
        return true;
    }
}

export function simbolTablePop(level) {
    while (main.simbolTable[main.simbolTable.length - 1].level > level) {
        main.simbolTable.pop();
    }
}

export function isProgram(lexema) {
    let item = main.simbolTable.find(function (item) {
        if (item.lexema == lexema && item.id == 'nomePrograma')
            return item;
    });
    if (item == undefined) {
        return false;
    } else {
        return true;
    }
}

export function searchTypeVarFunc(lexema) {
    let item;
    let result = undefined;
    for (let i = main.simbolTable.length - 1; i >= 0; i--) {
        item = main.simbolTable[i];
        if (item.lexema == lexema && (item.id == 'var' || item.id == "func")) {
            result = item;
            break;
        }
    }
    return result;

    // const item = main.simbolTable.find(function (item) {
    //     if (item.lexema == lexema && (item.id == 'var' || item.id == "func")) {
    //         return item;
    //     }
    // });
    // if (item == undefined) {
    //     return undefined;
    // }
    // return item;
}

export function searchTypeProc(lexema) {
    const item = main.simbolTable.find(function (item) {
        if (item.lexema == lexema && item.id == 'proc') {
            return item;
        }
    });
    if (item == undefined) {
        return undefined;
    }
    return item;
}