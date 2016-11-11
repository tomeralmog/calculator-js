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
    if(!e.srcElement){
      return;
    }
    var numCharacter = e.srcElement.innerText;
    if(!isNaN(parseInt(numCharacter))){
      this.inputNumber(numCharacter);
    } else {
      this.inputOperator(numCharacter);
    }
  };

  Calculator.prototype.onKeyPressed = function (e) {
    console.log(e)
  };

  Calculator.prototype.inputNumber = function (numCharacter) {
    if(this.operation === '' || this.textResult.slice(-1) === '.') {
      this.textResult += numCharacter;
      this.result = parseFloat(this.textResult);
      this.screen.value = this.textResult;
    } else {
      this.textResult = '';
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
        if(operator === '.'){
          this.calculatePrevOperation(operator);
        }

      } else {
        this.calculatePrevOperation(operator);
      }
    }
  };

  Calculator.prototype.calculatePrevOperation = function (nextOperator) {
    if(nextOperator === '.') {
      if(this.textResult.slice(-1) !== '.') {
        this.textResult += '.';
        this.screen.value = this.textResult;
      }
    } else {
      switch (this.operation) {
        case '+':
          this.result += parseInt(this.textResult);
          break;
        case '-':
          this.result -= parseInt(this.textResult);
          break;
        case 'x':
          this.result *= parseInt(this.textResult);
          break;
        case '÷':
          if (parseInt(this.textResult) === 0) {
            this.screen.value = 'Error: Can\'t divide by 0';
            return;
          } else {
            this.result /= parseInt(this.textResult);
            break;
          }


      }
      console.log('here?', this.operation)
      this.screen.value = this.result;
      if (nextOperator === '=') {
        this.operation = '';
        this.textResult = '';
      } else {
        this.operation = nextOperator;
      }
    }
  };




  var calculator = new Calculator(s.screen, s.buttons);
})();