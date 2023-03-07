function bcdiv(num, decimales) {
    let num_str = new String(num);
    let pad_ceros = new Array(decimales).fill("0").join('');
    let dot = num_str.indexOf('.');
    if (dot === -1) {
        return num_str + '.' + pad_ceros;
    }
    return num_str.substring(0, dot) + num_str.substr(dot, decimales+1) + pad_ceros.substring(num_str.length - dot - 1);
}

// Ejemplos: numero , n decimales que se desea sin redondear
//  > bcdiv(12.1, 4)
//  '12.1000'
//  > bcdiv(121.319911, 2)
//  '121.31'
