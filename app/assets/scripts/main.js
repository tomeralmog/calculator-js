(function () {
  var settings = {
    screen: $('calc-input'),
    buttons: $('buttons')
  };
  var s = settings;

  function $(elem) {
    return typeof elem === 'string' ? document.getElementById(elem) : elem;
  }

  function bindEventListener(target, type, listener) {
    if(window.addEventListener){
      $(target).addEventListener(type, listener);
    } else {
      $(target).attachEvent('on' + type, listener);
    }
  }


  function bind(context, callback) {
    var self = context;
    return function (event) {
        return callback.call(self, event);
    };
  }

  function Calculator(screen, buttons){
    this.screen = screen;
    this.buttons = buttons;
    this.blockActions = false;

    this.reset();
    this.bindEvents();
  }

  Calculator.prototype.reset = function () {
    this.result = 0;
    this.textResult = '';
    this.operation = '';
    this.screen.value = '0';
  };

  Calculator.prototype.bindEvents = function () {
    bindEventListener(this.buttons, 'click', bind(this, this.onButtonPressed));
    bindEventListener(window, 'keypress', bind(this, this.onKeyPressed));
  };

  Calculator.prototype.onButtonPressed = function (e) {
    if(!e.srcElement || this.blockActions){
      return;
    }

    this.blockActions = true;
    var numCharacter = e.srcElement.innerText;
    if(numCharacter.length > 1){
      this.blockActions = false;
      return;
    }

    if(!isNaN(parseInt(numCharacter)) || numCharacter === '.'){
      this.inputNumber(numCharacter);
    } else {
      console.log(numCharacter, numCharacter.length);

      if(numCharacter.length === 1) {
        this.inputOperator(numCharacter);
      }
    }
    this.blockActions = false;

  };

  Calculator.prototype.onKeyPressed = function (e) {
    console.log(e)
  };

  Calculator.prototype.inputNumber = function (numCharacter) {
    if( this.textResult.slice(-1) === '.' && numCharacter=== '.'){
      return;
    }
    if(this.operation === '') {
      this.textResult += numCharacter;
      if (this.textResult === '.'){ this.textResult = '0.'}
      this.result = parseFloat(this.textResult);
      this.screen.value = this.textResult;
    } else {
      this.textResult += numCharacter;
      this.screen.value = this.textResult;
    }
  };

  Calculator.prototype.inputOperator = function (operator) {
    if (operator === 'C') {
      this.reset();
    } else {
      if(this.operation === '') {
        this.operation = operator;
        this.textResult = '';
      } else if(this.textResult !== '' ){
        this.calculatePrevOperation(operator);
      }
    }
  };

  Calculator.prototype.calculatePrevOperation = function (nextOperator) {

    switch (this.operation) {
      case '+':
        this.result += parseFloat(this.textResult);
        break;
      case '-':
        this.result -= parseFloat(this.textResult);
        break;
      case 'x':
        this.result *= parseFloat(this.textResult);
        break;
      case '^':
        this.result = Math.pow(this.result, parseFloat(this.textResult));
        break;
      case '÷':
        if (parseFloat(this.textResult) === 0) {
          this.showError('Error: Can\'t divide by 0');
          return;
        } else {
          this.result /= parseFloat(this.textResult);
          break;
        }


    }

    this.textResult = '';
    console.log('here?', this.operation);
    this.screen.value = this.result;
    if (nextOperator === '=') {
      this.operation = '';
    } else {
      this.operation = nextOperator;
    }

  };

  Calculator.prototype.showError = function (errorMsg) {
    this.screen.value = errorMsg;
    this.screen.className = 'error';
    this.blockActions = true;
    var self = this;
    setTimeout(function(){
      self.reset();
      self.screen.className = '';
      self.blockActions = false;
    }, 2000);
  };




  var calculator = new Calculator(s.screen, s.buttons);
})();