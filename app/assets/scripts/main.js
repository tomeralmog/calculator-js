(function () {
  'use strict';
  var settings = {
    screen: $('calc-input'),
    buttons: $('buttons'),
    errorMsg: 'Error: Can\'t divide by 0'
  };
  var s = settings;

  // element selector
  function $(elem) {
    return typeof elem === 'string' ? document.getElementById(elem) : elem;
  }

  // cross platform event binding
  function bindEventListener(target, type, listener) {
    if (window.addEventListener) {
      $(target).addEventListener(type, listener);
    } else {
      $(target).attachEvent('on' + type, listener);
    }
  }

  // bind event with context
  function bind(context, callback) {
    var self = context;
    return function (event) {
      return callback.call(self, event);
    };
  }

  // main object
  function Calculator(screen, buttons) {
    this.screen = screen;
    this.buttons = buttons;
    this.blockActions = false;

    this.reset();
    this.bindEvents();
  }

  Calculator.prototype = {
    // define all private functions here
    constructor: Calculator,

    reset: function () {
      this.result = 0;
      this.textResult = '';
      this.operation = '';
      this.displayValue('0');
    },

    bindEvents: function () {
      bindEventListener(this.buttons, 'click', bind(this, this.onButtonPressed));
      bindEventListener(window, 'keypress', bind(this, this.onKeyPressed));
    },

    onButtonPressed: function (e) {
      if (!e.srcElement || this.blockActions) {
        return;
      }
      this.blockActions = true;
      var inputCharacter = e.srcElement.innerText;
      if (inputCharacter.length > 1) {
        // clicking quickly returns longer string sometimes.
        this.blockActions = false;
        return;
      }

      this.parseInput(inputCharacter);
      this.blockActions = false;

    },

    onKeyPressed: function (e) {
      // enter should function like equal operator
      if(e.charCode == 13 || e.keyCode === 13||
        e.code === 'Enter'|| e.keyIdentifier  === 'Enter' ){
        this.parseInput('=');
      } else {
        var ch = String.fromCharCode(e.charCode).toUpperCase();
        if ("0123456789.+-*/^=C".indexOf(ch) >= 0) {
          this.parseInput(ch);
        }
      }
    },

    parseInput: function(input){
      // separate numbers and operators. decimal point is treated as a number
      if (!isNaN(parseInt(input)) || input === '.') {
        this.inputNumber(input);
      } else {
        this.inputOperator(input);
      }
    },

    inputNumber: function (numCharacter) {
      // aviod multiple decimal points
      if (this.textResult.slice(-1) === '.' && numCharacter === '.') {
        return;
      }
      if (this.operation === '') {
        // accumulate the text by concatenating strings
        this.textResult += numCharacter;
        if (this.textResult === '.') {
          this.textResult = '0.'
        }
        //convert string value to a float value
        this.result = parseFloat(this.textResult);
        this.displayValue(this.textResult);
      } else {
        this.textResult += numCharacter;
        this.displayValue(this.textResult);
      }
    },

    inputOperator: function (operator) {
      if (operator === 'C') {
        this.reset();
      } else {
        if (this.operation === '') {
          this.operation = operator;
          this.textResult = '';
        } else if (this.textResult !== '') {
          this.calculatePrevOperation(operator);
        }
      }
    },

    calculatePrevOperation: function (nextOperator) {
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
      case '/':
      case '÷':
        if (parseFloat(this.textResult) === 0) {
          this.showError(s.errorMsg);
          return;
        } else {
          this.result /= parseFloat(this.textResult);
          break;
        }
      }

      this.textResult = '';
      this.displayValue(this.result);
      if (nextOperator === '=') {
        this.operation = '';
      } else {
        this.operation = nextOperator;
      }
    },

    displayValue: function(val){
      this.screen.value = val;
    },

    showError: function (errorMsg) {
      this.displayValue(errorMsg);
      this.screen.className = 'error';
      this.blockActions = true;
      var self = this;
      setTimeout(function () {
        self.reset();
        self.screen.className = '';
        self.blockActions = false;
      }, 2000);
    }

  };

  var calculator = new Calculator(s.screen, s.buttons);
})();