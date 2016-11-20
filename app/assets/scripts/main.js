(function () {
  'use strict';
  var settings = {
    screen: $('calc-input'),
    buttons: $('buttons'),
    errorMsg: 'Error: Can\'t divide by 0',
    errorTime: 2000
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



  /***
   * Object Calculator
   *
   * Calculator implementation, main object
   * has no public methods.
   *
   * @param screen - Screen object that implements show and error
   * @param buttons - DOM element that contains the buttons of the calcualtor
   */
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
        if ("0123456789.+-*/^=CX".indexOf(ch) >= 0) {
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
      case '*':
      case 'X':
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
      this.screen.show(val);
    },

    showError: function (errorMsg) {
      this.blockActions = true;
      var self = this;
      this.screen.error(errorMsg).then(function() {
        self.reset();
        self.blockActions = false;
      });
    }

  };

  /***
   * Object Screen
   *
   * Displays messages on a DOM element
   * has two public methods: show and error
   *
   * @param screenElement - DOM element to display messages on
   * @param errorTime - time in milliseconds to display error
   */
  function Screen(screenElement, errorTime){

    this.screenElement = screenElement;
    this.errorTime = errorTime;

    /***
     * function show
     * display a string or number on the screenElement
     *
     * @param val: string or number
     */
    this.show =  function(val){
      if(typeof val === 'string' || typeof val === 'number') {
        this.screenElement.value = val;
      }
    };


    /***
     * display an error message for errorTime millisecond.
     * appends error class to the screenElement and returns a promise
     * that resolves when the screen is back to regular display
     *
     * @param errorMsg: string
     * @returns {Promise}
     */
    this.error = function (errorMsg) {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.show(errorMsg);
        self.screenElement.className = 'error';

        setTimeout(function () {
          self.screenElement.className = '';
          resolve();
        }, self.errorTime);
      });

    };
  }

  var screen = new Screen(s.screen, s.errorTime);
  var calculator = new Calculator(screen, s.buttons);
})();