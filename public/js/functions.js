// Fonction pour me faciliter la tâche
const radians = (value)=>{ // Converti des degrés en radians
    return (value * (Math.PI / 180));
};
const constrain = (value, min, max)=>{ // Contraint une valeur entre un minimum et un maximum
    if(value < min) value = min;
    else if(value > max) value = max;
    return value;
};
const random = (min, max, integer = false) => { // Retourne une valeur aléatoire comprise entre un minimum et un maximum (peut être directement arrondie si besoin)
    let value = Math.random() * (max - min) + min;
    if(integer){
        value = Math.round(value);
    }
    return value;
};
const defineNavigator = () => { // Retourne le navigateur utilisé sous forme de caractère (Edge, Chrome ou Firefox)
    const navigatorsName = [
        "Edge",
        "Chrome",
        "Firefox"
    ];
    const userAgent = navigator.userAgent;
    for(let navigatorName of navigatorsName){
        if(userAgent.indexOf(navigatorName) > 1){
            return navigatorName;
        }
    }
    return undefined;
};

// Vendors
(function () {
    a = {
        _b: 0,
        c: function () {
            this._b++;
            return this.b;
        }
    };
    HTMLElement.prototype.pseudoStyle = function (d, e, f) {
        var g = "pseudoStyles";
        var h = document.head || document.getElementsByTagName('head')[0];
        var i = document.getElementById(g) || document.createElement('style');
        i.id = g;
        var j = "pseudoStyle" + a.c();
        this.className += " " + j;
        i.innerHTML += " ." + j + ":" + d + "{" + e + ":" + f + "}";
        h.appendChild(i);
        return this;
    };
})();