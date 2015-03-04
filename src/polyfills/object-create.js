// From MDN - https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/create
if (typeof Object.create != 'function') {
  Object.create = (function() {
    var Temp = function() {};
    return function (prototype) {
      if (arguments.length > 1) {
        throw Error('Cette prothèse ne supporte pas le second argument');
      }
      if (typeof prototype != 'object') {
        throw TypeError('L\'argument doit être un objet');
      }
      Temp.prototype = prototype;
      var result = new Temp();
      Temp.prototype = null;
      return result;
    };
  })();
}